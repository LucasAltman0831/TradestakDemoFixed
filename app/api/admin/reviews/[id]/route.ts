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
  const {data:review}=await admin.from('reviews').select('id,builder_user_id').eq('id',id).eq('moderation_status','pending').maybeSingle();
  if(!review)return NextResponse.json({error:'Pending review not found.'},{status:404});
  const {data:builder}=await admin.from('profiles').select('company_verification_status').eq('id',review.builder_user_id).maybeSingle();
  if(builder?.company_verification_status!=='verified')return NextResponse.json({error:'The builder company is no longer verified.'},{status:409});
  const approved=parsed.data.action==='approve';
  const {error}=await admin.from('reviews').update({verified:approved,is_public:approved,moderation_status:approved?'approved':'rejected',updated_at:new Date().toISOString()}).eq('id',id);
  return error?NextResponse.json({error:'Unable to update the written review.'},{status:500}):NextResponse.json({ok:true});
}
