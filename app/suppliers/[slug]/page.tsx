import Link from 'next/link';
import {notFound} from 'next/navigation';
import {BadgeCheck,Building2,Globe2,Images,MapPin,ShieldCheck} from 'lucide-react';
import {Nav} from '@/components/Nav';
import {AnalyticsEvent} from '@/components/Analytics';
import {EvaluationForm,SaveSupplierButton} from '@/components/SupplierActions';
import {ContactSupplier} from '@/components/ContactSupplier';
import {MeetingRequestForm} from '@/components/MeetingRequestForm';
import {PerformanceRatings,ScoreExplanation,SupplierVerificationBadge,SourceMetricScoreBadge,UnclaimedProfileBadge} from '@/components/brand/ReputationUI';
import {getViewer} from '@/lib/auth';
import styles from './supplier.module.css';

export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const {profile,supabase}=await getViewer();
  const {data:supplier}=await supabase.from('supplier_profiles').select('*').eq('slug',slug).eq('is_public',true).maybeSingle();
  if(!supplier)notFound();
  const [{data:reviews},{data:media}]=await Promise.all([
    supabase.from('reviews').select('id,project_name,project_type,body,verified,reviewer_company_name,created_at').eq('supplier_profile_id',supplier.id).eq('is_public',true).eq('moderation_status','approved').order('created_at',{ascending:false}).limit(10),
    supabase.from('profile_media').select('id,kind,public_url,caption').eq('supplier_profile_id',supplier.id).order('created_at',{ascending:false}),
  ]);
  const hasScores=supplier.review_count>=3&&supplier.score!==null;
  const location=[supplier.city,supplier.state].filter(Boolean).join(', ')||'Service area not provided';

  return <>
    <AnalyticsEvent event="supplier_profile_view" properties={{slug}}/>
    <Nav/>
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.identity}><span>{supplier.name.split(' ').map((part:string)=>part[0]).slice(0,2).join('')}</span><div><p>{supplier.trade_category||'Business supplier'} · {location}</p><h1>{supplier.name}</h1><div>{supplier.verified?<SupplierVerificationBadge/>:supplier.claimed?<span className="badge">Claimed · verification pending</span>:<UnclaimedProfileBadge/>}</div></div></div>
        <SourceMetricScoreBadge score={supplier.score??0} label={hasScores?`Based on ${supplier.review_count} verified business evaluations`:`Building performance history · ${supplier.review_count} verified evaluations`}/>
      </section>
      <section className={styles.layout}>
        <div>
          <article className={styles.about}><span>COMPANY OVERVIEW</span><h2>Company information</h2><p>{supplier.description||'This company has not added a description yet.'}</p><div className={styles.facts}><div><MapPin/><span>Location<b>{location}</b></span></div><div><Globe2/><span>Service area<b>{supplier.service_area||'Not provided'}</b></span></div><div><Building2/><span>Profile status<b>{supplier.verified?'SourceMetric verified':supplier.claimed?'Claimed':'Unclaimed'}</b></span></div></div></article>
          <article className={styles.gallery}><header><div><span>COMPANY PORTFOLIO</span><h2>Work, capabilities, and company photos</h2></div><Images/></header>{media?.length?<div>{media.map((item:any)=><figure key={item.id}><img src={item.public_url} alt={item.caption||`${supplier.name} company photo`}/><figcaption><b>{item.kind}</b><span>{item.caption||'Company media'}</span></figcaption></figure>)}</div>:<div className="empty">This company has not added portfolio images yet.</div>}</article>
          <article className={styles.performance}><header><div><span>REPUTATION DATA</span><h2>{hasScores?'Performance intelligence':'Awaiting buyer evaluations'}</h2></div></header>{hasScores?<PerformanceRatings quality={supplier.quality_score??0} delivery={supplier.delivery_score??0} communication={supplier.communication_score??0}/>:<div className="empty">SourceMetric does not display estimated or invented scores. Performance appears after buyers submit evaluations.</div>}<ScoreExplanation/></article>
          <article className={styles.credentials}><header><span>VERIFIED BUYER FEEDBACK</span><h2>Reviews with real company accountability</h2></header>{(reviews??[]).map((review:any)=><section key={review.id}><b>{review.project_name||'Buyer evaluation'}</b><p>{review.body||'This buyer submitted performance scores without a written comment.'}</p><small>{review.verified?'Verified builder company':'Pending verification'}{review.reviewer_company_name?` · ${review.reviewer_company_name}`:''}{review.project_type?` · ${review.project_type}`:''}</small></section>)}{!reviews?.length?<div className="empty">No verified public reviews have been submitted for this company.</div>:null}</article>
        </div>
        <aside className={styles.claimCard}>{profile?.role==='business'?<><span>BUSINESS ACTIONS</span><h2>Start a supplier relationship.</h2><SaveSupplierButton id={supplier.id}/><ContactSupplier supplierId={supplier.id}/><MeetingRequestForm supplierId={supplier.id}/>{profile.company_verification_status==='verified'?<EvaluationForm id={supplier.id}/>:<div className={styles.verificationGate}><ShieldCheck/><h3>Verify your company to evaluate suppliers.</h3><p>Only confirmed businesses with verified relationships can influence SourceMetric scores.</p><Link href="/verification">Start company verification</Link></div>}</>:!supplier.claimed?<><div className={styles.claimIcon}><Building2/></div><span>UNCLAIMED COMPANY</span><h2>Authorized to represent this company?</h2><p>Claim ownership to manage accurate company information.</p><Link href={`/claim/${supplier.slug}`}>Claim this profile</Link><small><ShieldCheck/>Claims are reviewed before ownership is granted.</small></>:<><div className={styles.claimIcon}><BadgeCheck/></div><span>COMPANY PROFILE</span><h2>{supplier.verified?'Verified by SourceMetric':'Owned by a company representative'}</h2><p>{supplier.verified?'SourceMetric has reviewed this company’s ownership information.':'Ownership is established; verification is still pending.'}</p></>}</aside>
      </section>
    </main>
  </>;
}
