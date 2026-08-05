import Link from 'next/link';
import {Nav} from '@/components/Nav';
import {CompanyMediaManager} from '@/components/CompanyMediaManager';
import {requireRole} from '@/lib/auth';
import {mediaLimit,planLabel} from '@/lib/entitlements';

export default async function ProfilePage(){
  const {user,profile,supabase}=await requireRole(['builder','supplier','admin']);
  const [{data:subscription},{data:media}]=await Promise.all([
    supabase.from('subscriptions').select('plan,status').eq('user_id',user.id).maybeSingle(),
    supabase.from('profile_media').select('id,kind,storage_path,public_url,caption').eq('owner_id',user.id).is('supplier_profile_id',null).order('created_at',{ascending:false}),
  ]);
  const verification=profile.company_verification_status||'unverified';
  return <><Nav/><main className="authPage" style={{display:'block',maxWidth:1100,margin:'0 auto'}}><section className="authCard" style={{width:'100%'}}><span className="badge">{profile.role==='builder'?'Business / Buyer':profile.role==='supplier'?'Supplier':'Administrator'}</span><h1>{profile.full_name||'Your profile'}</h1><p className="lede">Your secure SourceMetric account details.</p><div className="metricGrid"><div className="metric"><span>Company</span><strong style={{fontSize:20}}>{profile.company_name||'Not provided'}</strong></div><div className="metric"><span>Email</span><strong style={{fontSize:16}}>{profile.email||user.email}</strong></div>{profile.role!=='admin'?<div className="metric"><span>Company verification</span><strong style={{fontSize:18,textTransform:'capitalize'}}>{verification}</strong></div>:null}</div><p style={{color:'var(--muted)',fontSize:13,marginTop:24}}>Member since {new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric'}).format(new Date(profile.created_at))}</p>{profile.role!=='admin'?<Link className="button" href="/verification">{verification==='verified'?'View verification':'Verify company'}</Link>:null} {profile.role==='supplier'?<Link className="ghost" href="/supplier/profile">Manage supplier company and photos</Link>:null}</section>{profile.role==='builder'?<CompanyMediaManager initialMedia={(media??[]) as any} limit={mediaLimit('builder',subscription)} plan={planLabel('builder',subscription)}/>:null}</main></>;
}
