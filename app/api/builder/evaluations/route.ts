import {NextResponse} from 'next/server';
import {getViewer} from '@/lib/auth';
import {evaluationSchema} from '@/lib/validation';

export async function POST(request:Request){
  const {user,profile,supabase}=await getViewer();
  if(!user||profile?.role!=='builder')return NextResponse.json({error:'Business account required.'},{status:403});
  const parsed=evaluationSchema.safeParse(await request.json());
  if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message||'Invalid evaluation.'},{status:400});
  const {publish_review,project_name,project_type,review_body,...scores}=parsed.data;
  const {data:evaluation,error}=await supabase.from('evaluations').upsert({builder_user_id:user.id,...scores},{onConflict:'builder_user_id,supplier_profile_id'}).select('id').single();
  if(error||!evaluation)return NextResponse.json({error:error?.message||'Unable to save evaluation.'},{status:400});
  if(publish_review){
    const {error:reviewError}=await supabase.from('reviews').upsert({evaluation_id:evaluation.id,supplier_profile_id:scores.supplier_profile_id,builder_user_id:user.id,project_name:project_name||null,project_type:project_type||null,body:review_body,verified:false,is_public:true},{onConflict:'evaluation_id'});
    if(reviewError)return NextResponse.json({error:'Scores were saved, but the public review could not be published.'},{status:400});
  }
  return NextResponse.json({ok:true});
}
