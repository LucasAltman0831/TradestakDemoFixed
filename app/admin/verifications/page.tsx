import {Sidebar} from '@/components/Sidebar';
import {TrustReviewExperience} from '@/components/TrustReviewExperience';
import {requireRole} from '@/lib/auth';

export default async function TrustReviewPage(){
  const {supabase}=await requireRole(['admin']);
  const [{data:verifications},{data:reviews}]=await Promise.all([
    supabase.from('company_verification_requests').select('*').eq('status','pending').order('created_at'),
    supabase.from('reviews').select('id,business_user_id,supplier_profile_id,project_name,project_type,body,created_at,evaluations(relationship_context)').eq('moderation_status','pending').order('created_at'),
  ]);
  const builderIds=[...new Set((reviews??[]).map((item:any)=>item.business_user_id))];
  const supplierIds=[...new Set((reviews??[]).map((item:any)=>item.supplier_profile_id))];
  const requesterIds=[...new Set((verifications??[]).map((item:any)=>item.requester_user_id))];
  const [{data:builders},{data:suppliers},{data:requesters}]=await Promise.all([
    builderIds.length?supabase.from('profiles').select('id,company_name').in('id',builderIds):Promise.resolve({data:[]}),
    supplierIds.length?supabase.from('supplier_profiles').select('id,name').in('id',supplierIds):Promise.resolve({data:[]}),
    requesterIds.length?supabase.from('profiles').select('id,company_name').in('id',requesterIds):Promise.resolve({data:[]}),
  ]);
  const builderMap=new Map((builders??[]).map((item:any)=>[item.id,item.company_name]));
  const supplierMap=new Map((suppliers??[]).map((item:any)=>[item.id,item.name]));
  const requesterMap=new Map((requesters??[]).map((item:any)=>[item.id,item.company_name]));
  return <main className="shell"><Sidebar role="admin"/><TrustReviewExperience verifications={(verifications??[]).map((item:any)=>({...item,profileCompany:requesterMap.get(item.requester_user_id)||null}))} reviews={(reviews??[]).map((item:any)=>({...item,reviewerCompany:builderMap.get(item.business_user_id)||'Verified business',supplierName:supplierMap.get(item.supplier_profile_id)||'Supplier',relationshipContext:item.evaluations?.relationship_context||null}))}/></main>;
}
