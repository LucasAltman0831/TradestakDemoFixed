import Link from 'next/link';
import {Download,LockKeyhole,TrendingUp} from 'lucide-react';
import {requireRole} from '@/lib/auth';
import {hasPaidAccess,planLabel} from '@/lib/entitlements';
import {Sidebar} from '@/components/Sidebar';
import {WorkspaceHeading} from '@/components/WorkspaceHeading';

export default async function Page(){
  const {user,supabase}=await requireRole(['supplier']);
  const [{data:company},{data:subscription}]=await Promise.all([
    supabase.from('supplier_profiles').select('id,score,quality_score,delivery_score,communication_score,review_count').eq('owner_id',user.id).maybeSingle(),
    supabase.from('subscriptions').select('plan,status').eq('user_id',user.id).maybeSingle(),
  ]);
  const {data:evaluations}=company?await supabase.from('evaluations').select('quality,delivery,communication,notes,created_at').eq('supplier_profile_id',company.id).order('created_at',{ascending:false}):{data:[] as any[]};
  const paid=hasPaidAccess(subscription);
  const premium=paid&&subscription?.plan==='supplier_premium';
  return <main className="shell"><Sidebar role="supplier"/><section className="workspace"><WorkspaceHeading eyebrow="REPUTATION INTELLIGENCE" title="Performance" description="Track verified quality, delivery, and service results over time." action={premium?<a className="button" href="/api/supplier/performance-export"><Download size={15}/> Export report</a>:undefined}/><div className="metricGrid"><div className="metric"><small>SourceMetric score</small><strong>{company?.score??'—'}</strong><span>Verified evaluation average</span></div><div className="metric"><small>Quality</small><strong>{company?.quality_score??'—'}</strong><span>Current result</span></div><div className="metric"><small>Delivery</small><strong>{company?.delivery_score??'—'}</strong><span>Current result</span></div><div className="metric"><small>Evaluations</small><strong>{company?.review_count??0}</strong><span>Buyer submissions</span></div></div>{paid?<div className="panel" style={{marginTop:24}}><div style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'center'}}><div><span className="eyebrow"><TrendingUp size={14}/> {planLabel('supplier',subscription).toUpperCase()}</span><h2>Evaluation history</h2></div>{!premium?<Link className="button secondary" href="/pricing#plans">Unlock CSV exports</Link>:null}</div><table className="table"><thead><tr><th>Quality</th><th>Delivery</th><th>Service</th><th>Date</th></tr></thead><tbody>{(evaluations||[]).map((evaluation:any,index)=><tr key={index}><td>{evaluation.quality}</td><td>{evaluation.delivery}</td><td>{evaluation.communication}</td><td>{new Date(evaluation.created_at).toLocaleDateString()}</td></tr>)}</tbody></table>{!evaluations?.length&&<div className="empty">No verified evaluations yet. New buyer feedback will appear here.</div>}</div>:<div className="panel" style={{marginTop:24}}><span className="eyebrow"><LockKeyhole size={14}/> SUPPLIER GROWTH</span><h2>Understand how your reputation changes over time.</h2><p>Your free profile includes current scores. Growth unlocks the full evaluation history, performance trends, and a larger project portfolio. Premium also adds downloadable performance reports.</p><Link className="button" href="/pricing#plans">Compare supplier plans</Link></div>}</section></main>;
}
