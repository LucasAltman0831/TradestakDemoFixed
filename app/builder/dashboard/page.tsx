import Link from 'next/link';
import {Sidebar} from '@/components/Sidebar';
import {SupplierCard} from '@/components/SupplierCard';
import {WorkspaceHeading} from '@/components/WorkspaceHeading';
import {requireRole} from '@/lib/auth';
import {hasPaidAccess} from '@/lib/entitlements';
import type {Supplier} from '@/lib/types';

export default async function Page(){
  const {user,profile,supabase}=await requireRole(['builder']);
  const [{data:saved},{count:evaluations},{count:notifications},{data:subscription}]=await Promise.all([
    supabase.from('saved_suppliers').select('supplier_profiles(*)').eq('builder_user_id',user.id).order('created_at',{ascending:false}).limit(6),
    supabase.from('evaluations').select('*',{count:'exact',head:true}).eq('builder_user_id',user.id),
    supabase.from('notifications').select('*',{count:'exact',head:true}).eq('user_id',user.id).is('read_at',null),
    supabase.from('subscriptions').select('plan,status').eq('user_id',user.id).maybeSingle(),
  ]);
  const suppliers=(saved??[]).map((row:any)=>row.supplier_profiles).filter(Boolean) as Supplier[];
  const scored=suppliers.filter(supplier=>supplier.score!==null);
  const health=scored.length?Math.round(scored.reduce((sum,supplier)=>sum+(supplier.score??0),0)/scored.length):null;
  const pro=hasPaidAccess(subscription)&&subscription?.plan==='builder_pro';
  return <main className="shell"><Sidebar role="builder"/><section className="workspace"><WorkspaceHeading eyebrow="BUILDER WORKSPACE" title={`Welcome, ${profile.full_name?.split(' ')[0]||'Builder'}`} description={`${profile.company_name||'Your company'} supplier network, based only on your real TradeStak activity.`} action={<Link className="button" href="/marketplace">Discover suppliers</Link>}/><div className="metricGrid"><div className="metric"><small>Network health</small><strong>{pro?(health??'—'):'PRO'}</strong><span>{pro?(health===null?'Add scored suppliers to calculate':'Average saved-supplier score'):'Unlock network analytics'}</span></div><div className="metric"><small>Saved suppliers</small><strong>{suppliers.length}</strong><span>Your tracked network</span></div><div className="metric"><small>Evaluations</small><strong>{evaluations??0}</strong><span>Feedback submitted</span></div><div className="metric"><small>Unread notifications</small><strong>{notifications??0}</strong><span>Account activity</span></div></div><section style={{marginTop:28}}><WorkspaceHeading eyebrow="YOUR NETWORK" title="Saved suppliers" description="Companies your team has chosen to track." action={<Link href="/builder/analytics">View analytics</Link>}/><div className="marketGrid">{suppliers.map(supplier=><SupplierCard key={supplier.id} supplier={supplier}/>)}</div>{!suppliers.length?<div className="panel empty"><h2>Your supplier network is empty.</h2><p>Explore the live marketplace and save companies relevant to your projects.</p><Link className="button" href="/marketplace">Open marketplace</Link></div>:null}</section></section></main>;
}
