import {Nav} from '@/components/Nav';
import {MarketplaceSearch} from '@/components/MarketplaceSearch';
import {createClient} from '@/lib/supabase/server';
import type {Supplier} from '@/lib/types';

export default async function Page(){
  const supabase=await createClient();
  const {data,error}=await supabase.from('supplier_profiles').select('*').eq('is_public',true).order('verified',{ascending:false}).order('score',{ascending:false,nullsFirst:false}).order('name');
  const suppliers=(data??[]) as Supplier[];
  return <><Nav/><main className="marketplace"><div className="eyebrow">SUPPLIER DISCOVERY</div><h1>Find suppliers with the right fit.</h1><p className="lede">Search and compare suppliers using category, location, capabilities, profile status, and structured performance information.</p>{error?<div className="message error">The supplier directory is temporarily unavailable. Please try again shortly.</div>:<MarketplaceSearch suppliers={suppliers}/>} {!error&&!suppliers.length?<div className="panel empty"><h2>The directory is getting started.</h2><p>No supplier profiles have been published yet. Suppliers can create or claim a profile to join SourceMetric.</p></div>:null}</main></>;
}
