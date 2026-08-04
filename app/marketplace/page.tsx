import {Nav} from '@/components/Nav';
import {MarketplaceSearch} from '@/components/MarketplaceSearch';
import {createClient} from '@/lib/supabase/server';
import type {Supplier} from '@/lib/types';

export default async function Page(){
  const supabase=await createClient();
  const {data,error}=await supabase.from('supplier_profiles').select('*').eq('is_public',true).order('verified',{ascending:false}).order('score',{ascending:false,nullsFirst:false}).order('name');
  const suppliers=(data??[]) as Supplier[];
  return <><Nav/><main className="marketplace"><div className="eyebrow">LIVE TRADESTAK NETWORK</div><h1>Find suppliers you can trust.</h1><p className="lede">Search construction partners using company information and reputation data contributed by real TradeStak members.</p>{error?<div className="message error">The supplier network is temporarily unavailable. Please try again shortly.</div>:<MarketplaceSearch suppliers={suppliers}/>} {!error&&!suppliers.length?<div className="panel empty"><h2>The network is getting started.</h2><p>No supplier profiles have been published yet. Suppliers can join TradeStak to create the first verified company records.</p></div>:null}</main></>;
}
