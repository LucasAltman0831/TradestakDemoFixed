import {NextResponse} from 'next/server';
import {z} from 'zod';
import {getViewer} from '@/lib/auth';
import {createAdminClient} from '@/lib/supabase/admin';

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  const {profile}=await getViewer();
  if(profile?.role!=='admin')return NextResponse.json({error:'Admin access required.'},{status:403});
  const parsed=z.object({action:z.enum(['approve','reject'])}).safeParse(await request.json());
  if(!parsed.success)return NextResponse.json({error:'Invalid action.'},{status:400});
  const {id}=await params;
  const admin=createAdminClient();
  const {data:item}=await admin.from('company_verification_requests').select('*').eq('id',id).eq('status','pending').maybeSingle();
  if(!item)return NextResponse.json({error:'Pending verification request not found.'},{status:404});
  const approved=parsed.data.action==='approve';
  const now=new Date().toISOString();
  const {error:profileError}=await admin.from('profiles').update({company_verification_status:approved?'verified':'rejected',company_verified_at:approved?now:null,company_verified_by:approved?profile.id:null,legal_company_name:item.legal_company_name,business_website:item.business_website,business_phone:item.business_phone,company_registration_number:item.registration_number,updated_at:now}).eq('id',item.requester_user_id);
  if(profileError)return NextResponse.json({error:'Unable to update company verification.'},{status:500});
  if(item.account_role==='supplier'){
    const {error:supplierError}=await admin.from('supplier_profiles').update({verified:approved,updated_at:now}).eq('owner_id',item.requester_user_id);
    if(supplierError)return NextResponse.json({error:'The company was reviewed, but its supplier profile could not be updated.'},{status:500});
  }
  const {error}=await admin.from('company_verification_requests').update({status:approved?'approved':'rejected',reviewed_by:profile.id,reviewed_at:now,updated_at:now}).eq('id',id);
  return error?NextResponse.json({error:'Unable to finish the verification review.'},{status:500}):NextResponse.json({ok:true});
}
