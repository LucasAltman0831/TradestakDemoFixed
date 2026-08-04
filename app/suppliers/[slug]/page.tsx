import Link from 'next/link';
import {notFound} from 'next/navigation';
import {BadgeCheck,Building2,BriefcaseBusiness,CheckCircle2,Globe2,MapPin,ShieldCheck,Sparkles} from 'lucide-react';
import {Nav} from '@/components/Nav';
import {createClient} from '@/lib/supabase/server';
import {findDemoSupplier} from '@/lib/demo-suppliers';
import {PerformanceRatings,ScoreExplanation,SupplierVerificationBadge,TradeStakScoreBadge,TrustIndicators,UnclaimedProfileBadge} from '@/components/brand/ReputationUI';
import styles from './supplier.module.css';
import {isDemoMode} from '@/lib/runtime';
import {AnalyticsEvent} from '@/components/Analytics';

const projectExamples=['Residential development supply','Light-commercial foundations','Scheduled jobsite delivery'];
const certifications=['OSHA compliant','Licensed trade partner','Insured operations'];

export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const supabase=await createClient();
  const {data}=await supabase.from('supplier_profiles').select('*').eq('slug',slug).eq('is_public',true).maybeSingle();
  const supplier=data??(isDemoMode()?findDemoSupplier(slug):null);
  if(!supplier) notFound();
  const score=supplier.score??0;
  const unclaimed=!supplier.claimed;
  const years='years' in supplier&&typeof supplier.years==='number'?supplier.years:15;

  return <><AnalyticsEvent event="supplier_profile_view" properties={{slug}}/><Nav/><main className={styles.page}>
    <section className={styles.hero}><div className={styles.identity}><span>{supplier.name.split(' ').map((part:string)=>part[0]).slice(0,2).join('')}</span><div><p>{supplier.trade_category} · {supplier.city}, {supplier.state}</p><h1>{supplier.name}</h1><div>{supplier.verified?<SupplierVerificationBadge/>:<UnclaimedProfileBadge/>}</div></div></div><TradeStakScoreBadge score={score} label={score>=90?'Excellent Supplier':'Established Supplier'}/></section>
    <section className={styles.layout}><div>
      <article className={styles.about}><span>COMPANY OVERVIEW</span><h2>Known in the network.<br/>Ready to be claimed.</h2><p>{supplier.description||'This supplier profile contains foundational company and reputation information.'}</p><TrustIndicators reviews={supplier.review_count??0}/><div className={styles.facts}><div><MapPin/><span>Location<b>{supplier.city}, {supplier.state}</b></span></div><div><Globe2/><span>Service area<b>{supplier.service_area||'Not provided'}</b></span></div><div><BriefcaseBusiness/><span>Years active<b>{years} years</b></span></div></div></article>
      <article className={styles.performance}><header><div><span>REPUTATION SIGNALS</span><h2>Performance intelligence</h2></div><Sparkles/></header><PerformanceRatings quality={supplier.quality_score??0} delivery={supplier.delivery_score??0} communication={supplier.communication_score??0}/><ScoreExplanation/></article>
      <article className={styles.credentials}><header><span>SUPPLIER IDENTITY</span><h2>Project history and credentials</h2></header><div className={styles.identityGrid}><section><h3>Project examples</h3>{projectExamples.map(item=><p key={item}><Building2/>{item}</p>)}</section><section><h3>Certifications</h3>{certifications.map(item=><p key={item}><CheckCircle2/>{item}</p>)}</section><section><h3>Builder feedback</h3><blockquote>“Consistent quality and proactive schedule communication across multiple phases.”</blockquote><small>Verified regional builder evaluation</small></section></div></article>
    </div><aside className={styles.claimCard}>{unclaimed?<><div className={styles.claimIcon}><Building2/></div><span>THIS COMPANY IS ALREADY ON TRADESTAK</span><h2>Your company is already here.<br/>Claim your reputation.</h2><p>Take ownership of company details, respond to verified feedback, and show builders what your team has earned.</p><Link href={`/claim/${supplier.slug}`}>Claim This Profile</Link><small><ShieldCheck/>Authorization is reviewed before ownership is granted.</small></>:<><div className={styles.claimIcon}><BadgeCheck/></div><span>OWNERSHIP CONFIRMED</span><h2>This company profile is claimed.</h2><p>Company information is managed by an authorized representative.</p></>}<div className={styles.source}><b>Public information notice</b><p>This profile was created from public business information and TradeStak network signals.</p></div></aside></section>
  </main></>;
}
