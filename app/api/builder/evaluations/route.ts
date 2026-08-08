import {NextResponse} from 'next/server';
import {getViewer} from '@/lib/auth';
import {evaluationSchema} from '@/lib/validation';

export async function POST(request:Request){
  const {user,profile,supabase}=await getViewer();
  if(!user||profile?.role!=='business')return NextResponse.json({error:'Business account required.'},{status:403});
  if(profile.company_verification_status!=='verified')return NextResponse.json({error:'Your company must be verified before it can influence supplier scores or submit reviews.'},{status:403});
  const parsed=evaluationSchema.safeParse(await request.json());
  if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message||'Invalid evaluation.'},{status:400});
  const {publish_review,project_name,project_type,review_body,...scores}=parsed.data;
  const {data:evaluation,error}=await supabase.from('evaluations').upsert({business_user_id:user.id,relationship_verification_status:'pending',...scores},{onConflict:'business_user_id,supplier_profile_id'}).select('id').single();
  if(error||!evaluation)return NextResponse.json({error:error?.message||'Unable to save evaluation.'},{status:400});
  if(publish_review){
    const {error:reviewError}=await supabase.from('reviews').upsert({evaluation_id:evaluation.id,supplier_profile_id:scores.supplier_profile_id,business_user_id:user.id,project_name:project_name||null,project_type:project_type||null,body:review_body,reviewer_company_name:profile.company_name,verified:false,is_public:false,moderation_status:'pending'},{onConflict:'evaluation_id'});
    if(reviewError)return NextResponse.json({error:'Scores were saved, but the public review could not be published.'},{status:400});
  }
  return NextResponse.json({ok:true,review_status:publish_review?'pending_moderation':null});
}
