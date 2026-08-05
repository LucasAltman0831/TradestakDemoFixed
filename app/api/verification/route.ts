import {NextResponse} from 'next/server';
import {getViewer} from '@/lib/auth';
import {createAdminClient} from '@/lib/supabase/admin';
import {companyVerificationSchema} from '@/lib/validation';

const personalDomains=new Set(['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com','aol.com','proton.me','protonmail.com']);

function domainFromWebsite(value:string){try{return new URL(value).hostname.toLowerCase().replace(/^www\./,'')}catch{return ''}}

export async function POST(request:Request){
  const {user,profile,supabase}=await getViewer();
  if(!user||!profile||!['builder','supplier'].includes(profile.role))return NextResponse.json({error:'A business or supplier account is required.'},{status:403});
  if(!user.email_confirmed_at)return NextResponse.json({error:'Confirm your account email before requesting company verification.'},{status:403});
  const parsed=companyVerificationSchema.safeParse(await request.json());
  if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message||'Invalid verification request.'},{status:400});
  const data=parsed.data;
  if(data.work_email.toLowerCase()!==user.email?.toLowerCase())return NextResponse.json({error:'The work email must match the verified email on your SourceMetric account.'},{status:400});
  const emailDomain=data.work_email.split('@')[1]?.toLowerCase()||'';
  const websiteDomain=domainFromWebsite(data.business_website);
  const domainMatch=Boolean(websiteDomain&&!personalDomains.has(emailDomain)&&(websiteDomain===emailDomain||websiteDomain.endsWith(`.${emailDomain}`)||emailDomain.endsWith(`.${websiteDomain}`)));
  const {data:pending}=await supabase.from('company_verification_requests').select('id').eq('requester_user_id',user.id).eq('status','pending').maybeSingle();
  if(pending)return NextResponse.json({error:'You already have a verification request under review.'},{status:409});
  const admin=createAdminClient();
  const {error}=await admin.from('company_verification_requests').insert({requester_user_id:user.id,account_role:profile.role,legal_company_name:data.legal_company_name,business_website:data.business_website||null,work_email:data.work_email.toLowerCase(),business_phone:data.business_phone,registration_number:data.registration_number||null,supporting_details:data.supporting_details,email_domain:emailDomain,website_domain:websiteDomain||null,domain_match:domainMatch});
  if(error)return NextResponse.json({error:error.message},{status:400});
  const {error:profileError}=await admin.from('profiles').update({company_verification_status:'pending',legal_company_name:data.legal_company_name,business_website:data.business_website||null,business_phone:data.business_phone,company_registration_number:data.registration_number||null,updated_at:new Date().toISOString()}).eq('id',user.id);
  if(profileError)return NextResponse.json({error:'The request was received, but the account status could not be updated. Contact SourceMetric support.'},{status:500});
  return NextResponse.json({ok:true,status:'pending'});
}
