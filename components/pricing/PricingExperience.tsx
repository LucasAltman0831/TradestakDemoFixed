'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  CircleCheckBig,
  FileSpreadsheet,
  HardHat,
  Layers3,
  Menu,
  Network,
  ShieldCheck,
  TrendingUp,
  Users2,
  X,
  Zap,
} from 'lucide-react';
import {useState} from 'react';
import {CheckoutButton} from '@/components/PricingButtons';
import {BrandLogo} from '@/components/brand/BrandLogo';
import styles from './PricingExperience.module.css';

type Role='builders'|'suppliers';
type Plan={name:string;monthly:number|null;yearly:number|null;purpose:string;features:string[];recommended?:boolean;eyebrow?:string};

function PlanAction({role,plan}:{role:Role;plan:Plan}){if(role==='builders'&&plan.name==='Pro')return <CheckoutButton endpoint="/api/stripe/checkout/builder" label="Start Builder Pro" className={styles.planButton}/>;if(role==='suppliers'&&plan.name==='Growth')return <CheckoutButton endpoint="/api/stripe/checkout/supplier-verified" label="Start Supplier Growth" className={styles.planButton}/>;if(role==='suppliers'&&plan.name==='Premium')return <CheckoutButton endpoint="/api/stripe/checkout/supplier-premium" label="Start Supplier Premium" className={styles.planButton}/>;if(plan.name==='Enterprise')return <a className={styles.planButton} href="mailto:sales@tradestak.com?subject=TradeStak%20Enterprise">Talk to Enterprise Sales <ArrowRight size={14}/></a>;return <Link className={styles.planButton} href={role==='builders'?'/signup?role=builder':'/signup?role=supplier'}>{role==='builders'?'Start Building Smarter':'Claim Your Profile'} <ArrowRight size={14}/></Link>}

const plans:Record<Role,Plan[]>={
  builders:[
    {name:'Free',monthly:0,yearly:0,purpose:'Explore the supplier network and start building your shortlist.',features:['Browse the live supplier marketplace','View public scores and reviews','Save up to 5 suppliers','Submit verified evaluations','3 company or project images']},
    {name:'Pro',monthly:299,yearly:239,purpose:'Give your procurement team measurable tools for managing supplier risk.',recommended:true,eyebrow:'RECOMMENDED FOR BUILDERS',features:['Unlimited saved suppliers','Live network health analytics','Supplier risk flags','Downloadable network CSV','25 company or project images','Everything in Builder Free']},
    {name:'Enterprise',monthly:null,yearly:null,purpose:'Plan a tailored rollout for larger procurement organizations.',features:['Everything in Builder Pro','Custom rollout planning','Security and data review','Commercial terms for your organization','Direct implementation consultation']},
  ],
  suppliers:[
    {name:'Claim Free',monthly:0,yearly:0,purpose:'Own your company presence and keep your essential information current.',features:['Claim and manage your company profile','Public marketplace visibility','Current reputation scores','Manage service details','4 company or project images']},
    {name:'Growth',monthly:99,yearly:79,purpose:'Understand your reputation and present a stronger body of work.',recommended:true,eyebrow:'BEST FOR GROWTH',features:['Full evaluation history','Performance trend visibility','20-image company portfolio','Current reputation scores','Everything in Claim Free']},
    {name:'Premium',monthly:249,yearly:199,purpose:'Give your team deeper reporting and a portfolio built to scale.',features:['Downloadable performance reports','60-image company portfolio','Full evaluation history','Performance trend visibility','Everything in Supplier Growth']},
  ],
};

const faqs=[
  {q:'What is TradeStak?',a:'TradeStak is the reputation intelligence network for construction. Builders use it to discover and evaluate suppliers, while suppliers use it to prove performance and grow their visibility.'},
  {q:'Who uses TradeStak?',a:'TradeStak is designed for construction builders, purchasing teams, suppliers, distributors, manufacturers, and trade partners who need better information before starting a business relationship.'},
  {q:'Can suppliers claim their profile?',a:'Yes. Suppliers can claim an existing profile for free, establish company ownership, update core details, and add company or project photos.'},
  {q:'Does TradeStak replace procurement software?',a:'No. TradeStak complements procurement and ERP systems by adding supplier reputation, performance intelligence, discovery, and network insights before and between transactions.'},
  {q:'Can I cancel anytime?',a:'Yes. Monthly plans can be canceled at any time. Annual plans remain active through the end of the prepaid term.'},
];

function Brand(){return <BrandLogo variant="horizontal" size="sm" className={styles.brand}/>}

export function PricingExperience(){
  const [role,setRole]=useState<Role>('builders');
  const [openFaq,setOpenFaq]=useState(0);
  const [menuOpen,setMenuOpen]=useState(false);
  const activePlans=plans[role];

  return <div className={styles.page}>
    <header className={styles.nav}><Brand/><nav className={menuOpen?styles.menuOpen:''}><Link href="/marketplace">Supplier network</Link><a href="#plans">Plans</a><a href="#compare">Why TradeStak</a><a href="#faq">FAQ</a></nav><div className={styles.navActions}><Link href="/login">Sign in</Link><Link href="/signup">Get started <ArrowRight size={14}/></Link><button onClick={()=>setMenuOpen(v=>!v)} aria-label="Toggle navigation">{menuOpen?<X size={20}/>:<Menu size={20}/>}</button></div></header>

    <main>
      <section className={styles.hero}><div className={styles.heroGrid}/><div className={styles.heroContent}><div className={styles.eyebrow}><ShieldCheck size={14}/>PRICING BUILT AROUND YOUR ROLE</div><h1>Choose the TradeStak experience<br/><em>that fits your role.</em></h1><p>Start free. Upgrade only when the additional tools create real value for your company.</p><div className={styles.roleSwitch}><button className={role==='builders'?styles.activeRole:''} onClick={()=>setRole('builders')}><HardHat size={17}/><span><b>Builders & Buyers</b><small>Discover and manage suppliers</small></span></button><button className={role==='suppliers'?styles.activeRole:''} onClick={()=>setRole('suppliers')}><Building2 size={17}/><span><b>Suppliers & Trade Partners</b><small>Build reputation and visibility</small></span></button></div><div className={styles.billingToggle}><span className={styles.activePeriod}>Monthly billing</span><b>Cancel anytime</b></div></div><aside className={styles.heroProof}><ShieldCheck size={22}/><span>REPUTATION, NOT PAY-TO-PLAY</span><h3>Paid plans unlock better tools—not better scores.</h3><p>Payment never changes a supplier’s score, marketplace rank, or verification decision.</p></aside></section>

      <section className={styles.plansSection} id="plans"><header><div><span>{role==='builders'?'BUILDERS & BUYERS':'SUPPLIERS & TRADE PARTNERS'}</span><h2>{role==='builders'?'Reduce supplier risk before it impacts your project.':'Turn your reputation into useful business intelligence.'}</h2></div><p>{role==='builders'?'Move from supplier discovery to confident project decisions with verified performance intelligence.':'Start with a real company profile, then unlock deeper reporting and a larger portfolio.'}</p></header><div className={styles.planGrid}>{activePlans.map((plan,index)=><article className={`${styles.planCard} ${plan.recommended?styles.recommended:''}`} key={plan.name}>{plan.recommended&&<div className={styles.recommendedLabel}><Zap size={11}/> {plan.eyebrow}</div>}<div className={styles.planTop}><span>0{index+1}</span><h3>{plan.name}</h3><p>{plan.purpose}</p></div><div className={styles.price}>{plan.monthly===null?<strong>Custom</strong>:<><strong>${plan.monthly}</strong><span>/month</span></>}</div><PlanAction role={role} plan={plan}/><div className={styles.features}><b>WHAT&apos;S INCLUDED TODAY</b>{plan.features.map(feature=><span key={feature}><Check size={13}/>{feature}</span>)}</div></article>)}</div><div className={styles.assurance}><span><CircleCheckBig size={16}/>No setup fees</span><span><CircleCheckBig size={16}/>Cancel anytime</span><span><CircleCheckBig size={16}/>Scores are never pay-to-play</span><a href="#compare">Compare every feature <ArrowRight size={13}/></a></div></section>

      <section className={styles.comparison} id="compare"><div className={styles.sectionIntro}><span>WHY COMPANIES CHOOSE TRADESTAK</span><h2>Move from scattered knowledge<br/>to supplier intelligence.</h2><p>TradeStak turns what your teams know—and what suppliers have earned—into a network everyone can act on.</p></div><div className={styles.compareTable}><div className={styles.compareHeader}><span>HOW SUPPLIER DECISIONS GET MADE</span><div><FileSpreadsheet size={18}/><b>Traditional management</b></div><div><Layers3 size={18}/><b>With TradeStak</b></div></div>{[['Supplier records','Spreadsheet tracking','Centralized network'],['Market visibility','Limited visibility','Verified reputation'],['Decision timing','Reactive decisions','Proactive intelligence'],['Team knowledge','Scattered feedback','Shared performance data'],['Risk detection','After problems occur','Early risk signals'],['Supplier discovery','Referrals and search','Evidence-based matching']].map(([area,oldWay,newWay])=><div className={styles.compareRow} key={area}><span>{area}</span><div><X size={13}/>{oldWay}</div><div><Check size={13}/>{newWay}</div></div>)}</div><div className={styles.outcomeCards}><article><Network size={20}/><strong>One connected network</strong><p>Give procurement, operations, and project teams the same supplier view.</p></article><article><BarChart3 size={20}/><strong>Decisions backed by evidence</strong><p>Compare performance signals instead of relying on disconnected anecdotes.</p></article><article><TrendingUp size={20}/><strong>Reputation that compounds</strong><p>Help great suppliers turn verified performance into durable market trust.</p></article></div></section>

      <section className={styles.faq} id="faq"><div className={styles.faqIntro}><span>FREQUENTLY ASKED QUESTIONS</span><h2>Clear answers before<br/>you join the network.</h2><p>Have a question about an enterprise rollout?</p><a href="mailto:sales@tradestak.com">Talk with our team <ArrowRight size={13}/></a></div><div className={styles.faqList}>{faqs.map((item,index)=><article className={openFaq===index?styles.openFaq:''} key={item.q}><button onClick={()=>setOpenFaq(openFaq===index?-1:index)}><span>0{index+1}</span><b>{item.q}</b><ChevronDown size={17}/></button>{openFaq===index&&<p>{item.a}</p>}</article>)}</div></section>

      <section className={styles.cta}><div className={styles.ctaGrid}/><BadgeCheck size={24}/><span>BUILD BETTER RELATIONSHIPS</span><h2>Your next trusted partner<br/>is already in the network.</h2><p>Start free today. Build confidence with every supplier decision.</p><div><Link href="/signup?role=builder">I&apos;m a Builder <ArrowRight size={15}/></Link><Link href="/signup?role=supplier">I&apos;m a Supplier <ArrowRight size={15}/></Link></div></section>
    </main>

    <footer className={styles.footer}><Brand/><p>Reputation intelligence for construction.</p><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><span>© 2026 TradeStak</span></div></footer>
  </div>;
}
