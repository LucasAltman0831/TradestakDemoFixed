import {NextResponse} from 'next/server';
import {z} from 'zod';
import {getViewer} from '@/lib/auth';

export async function POST(req:Request){
  const {user,profile,supabase}=await getViewer();
  if(!user||profile?.role!=='business')return NextResponse.json({error:'Business account required.'},{status:403});
  const parsed=z.object({supplier_id:z.string().uuid()}).safeParse(await req.json());
  if(!parsed.success)return NextResponse.json({error:'Invalid supplier.'},{status:400});
  const {error}=await supabase.from('saved_suppliers').upsert({business_user_id:user.id,supplier_profile_id:parsed.data.supplier_id},{onConflict:'business_user_id,supplier_profile_id'});
  return error?NextResponse.json({error:error.message},{status:400}):NextResponse.json({ok:true});
}
