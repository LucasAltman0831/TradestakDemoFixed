import Link from 'next/link';
import {BadgeCheck,CalendarDays,CircleAlert,CreditCard,ShieldCheck,Sparkles} from 'lucide-react';
import {PortalButton,CheckoutButton} from '@/components/PricingButtons';
import {paidPlans,isPaidPlan} from '@/lib/stripe';
import type {Role} from '@/lib/types';
import styles from './BillingExperience.module.css';

type Subscription={plan:string;status:string;current_period_end:string|null;stripe_customer_id:string|null}|null;
const statusNames:Record<string,string>={active:'Active',trialing:'Trial',past_due:'Payment needs attention',canceled:'Canceled',unpaid:'Unpaid',checkout_started:'Checkout incomplete',free:'Free'};

export function BillingExperience({role,subscription,checkout}:{role:Extract<Role,'builder'|'supplier'>;subscription:Subscription;checkout?:string}){
  const config=subscription&&isPaidPlan(subscription.plan)?paidPlans[subscription.plan]:null;const defaultName=role==='builder'?'TradeStak Builder Free':'TradeStak Supplier Claim Free';
  const renewal=subscription?.current_period_end?new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(new Date(subscription.current_period_end)):null;
  return <div className={styles.page}>
    <header><div><span className={styles.eyebrow}><CreditCard size={13}/> Billing & subscription</span><h1>Manage your TradeStak plan.</h1><p>Plan details, payment status, and upgrades in one secure workspace.</p></div><Link href={role==='builder'?'/builder/dashboard':'/supplier/dashboard'}>Back to dashboard</Link></header>
    {checkout==='success'?<div className={styles.success}><BadgeCheck/> Checkout complete. Stripe is confirming your subscription; your plan will update automatically.</div>:null}
    {checkout==='canceled'?<div className={styles.notice}><CircleAlert/> Checkout was canceled. No changes were made to your plan.</div>:null}
    <section className={styles.planCard}><div className={styles.planIdentity}><span>CURRENT PLAN</span><h2>{config?.name??defaultName}</h2><p>{role==='builder'?'Supplier intelligence for your procurement team.':'Reputation and visibility tools for your company.'}</p></div><div className={styles.planFacts}><div><ShieldCheck/><span>Status<strong>{statusNames[subscription?.status??'free']??subscription?.status}</strong></span></div><div><CalendarDays/><span>{renewal?'Renews':'Billing cycle'}<strong>{renewal??'No renewal scheduled'}</strong></span></div></div>{subscription?.stripe_customer_id?<PortalButton/>:<Link className="button" href="/pricing">Explore paid plans</Link>}</section>
    <section className={styles.options}><header><div><span>UPGRADE OPTIONS</span><h2>{role==='builder'?'Unlock deeper network intelligence.':'Turn your reputation into growth.'}</h2></div><Sparkles/></header><div className={styles.optionGrid}>{role==='builder'?<><article><b>Builder Pro</b><strong>$299<small>/month</small></strong><p>Risk alerts, comparisons, advanced analytics, supplier tracking, and team access.</p><CheckoutButton endpoint="/api/stripe/checkout/builder" label="Start Builder Pro"/></article><article><b>Builder Enterprise</b><strong>Custom</strong><p>Unlimited users, multi-market visibility, custom reporting, API access, and onboarding.</p><a className="button full" href="mailto:sales@tradestak.com?subject=TradeStak%20Builder%20Enterprise">Contact sales</a></article></>:<><article><b>Supplier Verified</b><strong>$99<small>/month</small></strong><p>Verified badge, enhanced profile, builder discovery boost, and reputation tracking.</p><CheckoutButton endpoint="/api/stripe/checkout/supplier-verified" label="Become Verified"/></article><article><b>Supplier Premium</b><strong>$249<small>/month</small></strong><p>Priority visibility, competitive insights, lead generation, and advanced analytics.</p><CheckoutButton endpoint="/api/stripe/checkout/supplier-premium" label="Start Premium"/></article></>}</div></section>
    <footer><ShieldCheck size={16}/> Payments and subscription management are securely handled by Stripe.</footer>
  </div>;
}
