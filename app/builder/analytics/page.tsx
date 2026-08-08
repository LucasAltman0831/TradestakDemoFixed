import Link from 'next/link';
import {AlertTriangle,Download,ShieldCheck} from 'lucide-react';
import {requireRole} from '@/lib/auth';
import {Sidebar} from '@/components/Sidebar';
import {WorkspaceHeading} from '@/components/WorkspaceHeading';
import type {Supplier} from '@/lib/types';

export default async function Page(){
  const {user,supabase}=await requireRole(['business']);
  const {data:saved}=await supabase.from('saved_suppliers').select('supplier_profiles(*)').eq('business_user_id',user.id);
  const suppliers=(saved??[]).map((row:any)=>row.supplier_profiles).filter(Boolean) as Supplier[];
  const scored=suppliers.filter(item=>item.score!==null);
  const average=scored.length?Math.round(scored.reduce((sum,item)=>sum+(item.score??0),0)/scored.length):null;
  const risks=scored.filter(item=>(item.score??100)<70||((item.quality_score??0)-(item.delivery_score??0)>=10));

  return <main className="shell"><Sidebar role="business"/><section className="workspace">
    <WorkspaceHeading eyebrow="FREE BUYER INTELLIGENCE" title="Supplier analytics" description="Use the performance data in your saved network to identify strengths and risks." action={<a className="button" href="/api/builder/network-export"><Download size={15}/> Export network</a>}/>
    <div className="metricGrid"><div className="metric"><small>Network health</small><strong>{average??'—'}</strong><span>Average scored supplier</span></div><div className="metric"><small>Tracked suppliers</small><strong>{suppliers.length}</strong><span>Saved to your network</span></div><div className="metric"><small>Scored suppliers</small><strong>{scored.length}</strong><span>With buyer evidence</span></div><div className="metric"><small>Risk signals</small><strong>{risks.length}</strong><span>Needs procurement review</span></div></div>
    <div className="panel" style={{marginTop:24}}><span className="eyebrow"><AlertTriangle size={14}/> RISK REVIEW</span><h2>Suppliers requiring attention</h2>{risks.map(item=><div key={item.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,padding:'16px 0',borderTop:'1px solid var(--line)'}}><div><b>{item.name}</b><p style={{margin:'5px 0 0'}}>Score {item.score??'—'} · Delivery {item.delivery_score??'—'} · Quality {item.quality_score??'—'}</p></div><Link href={`/suppliers/${item.slug}`}>Review profile</Link></div>)}{!risks.length?<div className="empty"><ShieldCheck/> No current risk signals in your scored supplier network.</div>:null}</div>
  </section></main>;
}
