import Link from 'next/link';
import {BadgeCheck,CalendarDays,CircleAlert,CreditCard,ShieldCheck,Sparkles} from 'lucide-react';
import {PortalButton} from '@/components/PricingButtons';
import {paidPlans,isPaidPlan} from '@/lib/stripe';
import type {Role} from '@/lib/types';
import styles from './BillingExperience.module.css';

type Subscription={plan:string;status:string;current_period_end:string|null;stripe_customer_id:string|null}|null;
const statusNames:Record<string,string>={active:'Active',trialing:'Trial',past_due:'Payment needs attention',canceled:'Canceled',unpaid:'Unpaid',checkout_started:'Checkout incomplete',free:'Free'};

export function BillingExperience({role,subscription,checkout}:{role:Extract<Role,'builder'|'supplier'>;subscription:Subscription;checkout?:string}){
  const config=subscription&&isPaidPlan(subscription.plan)?paidPlans[subscription.plan]:null;
  const defaultName=role==='builder'?'SourceMetric Business Free':'SourceMetric Supplier Profile';
  const renewal=subscription?.current_period_end?new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(new Date(subscription.current_period_end)):null;

  return <div className={styles.page}>
    <header><div><span className={styles.eyebrow}><CreditCard size={13}/> Billing & subscription</span><h1>Manage your SourceMetric plan.</h1><p>Plan details, payment status, and upgrades in one secure workspace.</p></div><Link href={role==='builder'?'/builder/dashboard':'/supplier/dashboard'}>Back to dashboard</Link></header>
    {checkout==='success'?<div className={styles.success}><BadgeCheck/> Checkout complete. Stripe is confirming your subscription; your plan will update automatically.</div>:null}
    {checkout==='canceled'?<div className={styles.notice}><CircleAlert/> Checkout was canceled. No changes were made to your plan.</div>:null}
    <section className={styles.planCard}><div className={styles.planIdentity}><span>CURRENT PLAN</span><h2>{config?.name??defaultName}</h2><p>{role==='builder'?'Supplier intelligence for your procurement work.':'Your company profile and participation are free at launch.'}</p></div><div className={styles.planFacts}><div><ShieldCheck/><span>Status<strong>{statusNames[subscription?.status??'free']??subscription?.status}</strong></span></div><div><CalendarDays/><span>{renewal?'Renews':'Billing cycle'}<strong>{renewal??'No renewal scheduled'}</strong></span></div></div>{subscription?.stripe_customer_id?<PortalButton/>:<Link className="button" href="/pricing">View plan details</Link>}</section>
    <section className={styles.options}><header><div><span>{role==='builder'?'BUYER ACCESS':'SUPPLIER ACCESS'}</span><h2>{role==='builder'?'The complete buyer workflow is free.':'Participate free. Upgrade only after we prove value.'}</h2></div><Sparkles/></header><div className={`${styles.optionGrid} ${role==='builder'?'billing-business-options':'billing-supplier-options'}`}>{role==='builder'?<article><b>Buyer Access</b><strong>Free</strong><p>Search, compare, save, evaluate, contact, and track suppliers without a credit card.</p><Link className="button full" href="/marketplace">Explore suppliers</Link></article>:<>
      <article><b>Supplier Basic</b><strong>Free</strong><p>Claim your company, manage accurate information, receive buyer activity, respond to inquiries as they launch, and view your earned score.</p><Link className="button full" href="/supplier/profile">Manage company profile</Link></article>
      <article><b>Supplier Pro</b><strong>$29<small>/month later</small></strong><p>Planned analytics, benchmarking, team users, reports, and advanced profile tools. Not yet for sale.</p><button className="button full" disabled>Planned after buyer activity</button></article>
      <article><b>Supplier Growth</b><strong>$79<small>/month later</small></strong><p>Planned inquiry analytics, multi-location tools, team response visibility, and contact insights. Not yet for sale.</p><button className="button full" disabled>Planned after buyer activity</button></article>
    </>}</div></section>
    <footer><ShieldCheck size={16}/> Payments are securely handled by Stripe. Supplier payments never influence scores or ranking.</footer>
  </div>;
}
