import {notFound} from 'next/navigation';
import {ClaimWorkflow} from '@/components/ClaimWorkflow';
import {createClient} from '@/lib/supabase/server';

export default async function Page({params}:{params:Promise<{supplier:string}>}){
  const {supplier:slug}=await params;
  const supabase=await createClient();
  const {data:company}=await supabase.from('supplier_profiles').select('name,slug,trade_category,city,state,service_area,claimed').eq('slug',slug).eq('is_public',true).maybeSingle();
  if(!company||company.claimed)notFound();
  return <ClaimWorkflow supplier={{...company,description:null,score:0,quality_score:0,delivery_score:0,communication_score:0,review_count:0,verified:false,source_name:'SourceMetric network',years:0}}/>;
}
