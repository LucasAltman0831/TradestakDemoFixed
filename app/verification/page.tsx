import {Nav} from '@/components/Nav';
import {VerificationExperience} from '@/components/VerificationExperience';
import {requireRole} from '@/lib/auth';

export default async function VerificationPage(){
  const {user,profile,supabase}=await requireRole(['business','supplier']);
  const {data:request}=await supabase.from('company_verification_requests').select('status,legal_company_name,work_email,created_at').eq('requester_user_id',user.id).order('created_at',{ascending:false}).limit(1).maybeSingle();
  return <><Nav/><VerificationExperience profile={profile} request={(request??null) as any}/></>;
}
