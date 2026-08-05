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
  Layers3,
  Menu,
  Network,
  PackageCheck,
  ShieldCheck,
  TrendingUp,
  Users2,
  X,
  Zap,
} from 'lucide-react';
import {useState} from 'react';
import {BrandLogo} from '@/components/brand/BrandLogo';
import styles from './PricingExperience.module.css';

type Role='builders'|'suppliers';
type Plan={name:string;monthly:number|null;yearly:number|null;purpose:string;features:string[];recommended?:boolean;eyebrow?:string;future?:boolean};

function PlanAction({role,plan}:{role:Role;plan:Plan}){if(plan.future)return <button className={styles.planButton} type="button" disabled>Planned — not for sale</button>;return <Link className={styles.planButton} href={role==='builders'?'/signup?role=builder':'/signup?role=supplier'}>{role==='builders'?'Use SourceMetric free':'Claim your profile free'} <ArrowRight size={14}/></Link>}

const plans:Record<Role,Plan[]>={
  builders:[
    {name:'Buyer Access',monthly:0,yearly:0,purpose:'Free supplier intelligence for purchasing professionals.',recommended:true,eyebrow:'FREE FOR BUYERS',features:['Supplier search and public profiles','SourceMetric Scores and performance data','Buyer reviews','Compare and save suppliers','Contact suppliers as inquiries launch','Submit verified reviews','Supplier network analytics and basic scorecards','No credit card required']},
  ],
  suppliers:[
    {name:'Basic',monthly:0,yearly:0,purpose:'Participate in the SourceMetric network and manage your company presence free.',recommended:true,eyebrow:'FREE FOR SUPPLIERS',features:['Claim and manage your company profile','Correct company information','Add capabilities, locations, and service areas','Receive and respond to buyer inquiries as they launch','Upload company information','View your earned SourceMetric Score and reviews','No pay-to-rank placement']},
    {name:'Supplier Pro',monthly:29,yearly:24,purpose:'Optional business tools after SourceMetric is delivering genuine buyer activity.',future:true,features:['Detailed profile and inquiry analytics','Performance trends and category benchmarking','Additional team users','Downloadable performance reports','Advanced profile customization']},
    {name:'Supplier Growth',monthly:79,yearly:65,purpose:'Opportunity management for suppliers handling meaningful buyer demand.',future:true,features:['Everything planned for Supplier Pro','Multiple locations','Inquiry management and team assignment','Response-time and opportunity analytics','CRM integrations as the product matures']},
    {name:'Enterprise',monthly:null,yearly:null,purpose:'Future multi-location and integration support for larger suppliers.',future:true,features:['Custom team and location requirements','Advanced reporting and controls','Integration planning','Dedicated implementation support']},
  ],
};

const faqs=[
  {q:'What is SourceMetric?',a:'SourceMetric is a supplier intelligence platform. Businesses use it to find, evaluate, compare, and track suppliers using structured performance information.'},
  {q:'Who uses SourceMetric?',a:'SourceMetric is designed for purchasing teams, procurement professionals, operations leaders, suppliers, distributors, and manufacturers who need better information before starting or renewing a supplier relationship.'},
  {q:'Can suppliers claim their profile?',a:'Yes. Suppliers can claim an existing profile for free, establish company ownership, update core details, and add company or capability photos.'},
  {q:'Does SourceMetric replace procurement software?',a:'No. SourceMetric complements procurement and ERP systems by adding supplier reputation, performance intelligence, discovery, and network insights before and between transactions.'},
  {q:'Is SourceMetric free at launch?',a:'Yes. Buyer access is free, and suppliers can claim and manage their profiles free. Future supplier subscriptions will add optional business tools only after SourceMetric is delivering proven buyer activity.'},
];

function Brand(){return <BrandLogo variant="horizontal" size="sm" className={styles.brand}/>}

export function PricingExperience(){
  const [role,setRole]=useState<Role>('builders');
  const [openFaq,setOpenFaq]=useState(0);
  const [menuOpen,setMenuOpen]=useState(false);
  const activePlans=plans[role];

  return <div className={styles.page}>
    <header className={styles.nav}><Brand/><nav className={menuOpen?styles.menuOpen:''}><Link href="/marketplace">Supplier network</Link><a href="#plans">Plans</a><a href="#compare">Why SourceMetric</a><a href="#faq">FAQ</a></nav><div className={styles.navActions}><Link href="/login">Sign in</Link><Link href="/signup">Get started <ArrowRight size={14}/></Link><button onClick={()=>setMenuOpen(v=>!v)} aria-label="Toggle navigation">{menuOpen?<X size={20}/>:<Menu size={20}/>}</button></div></header>

    <main>
      <section className={styles.hero}><div className={styles.heroGrid}/><div className={styles.heroContent}><div className={styles.eyebrow}><ShieldCheck size={14}/>LAUNCH ACCESS BUILT FOR NETWORK GROWTH</div><h1>Free for buyers.<br/><em>Free for suppliers to participate.</em></h1><p>Build the network first. Introduce optional supplier business tools only after SourceMetric creates proven value.</p><div className={styles.roleSwitch}><button className={role==='builders'?styles.activeRole:''} onClick={()=>setRole('builders')}><Building2 size={17}/><span><b>Businesses & Buyers</b><small>Free supplier intelligence</small></span></button><button className={role==='suppliers'?styles.activeRole:''} onClick={()=>setRole('suppliers')}><PackageCheck size={17}/><span><b>Suppliers</b><small>Free profile and participation</small></span></button></div><div className={styles.billingToggle}><span className={styles.activePeriod}>Free launch access</span><b>No credit card</b></div></div><aside className={styles.heroProof}><ShieldCheck size={22}/><span>REPUTATION, NOT PAY-TO-PLAY</span><h3>Business tools can be paid. Reputation cannot.</h3><p>Payment will never change a supplier’s score, organic rank, review history, or verification decision.</p></aside></section>

      <section className={styles.plansSection} id="plans"><header><div><span>{role==='builders'?'BUSINESSES & BUYERS':'SUPPLIERS'}</span><h2>{role==='builders'?'Free supplier intelligence for purchasing professionals.':'Participate free. Pay later only for proven business value.'}</h2></div><p>{role==='builders'?'Search, evaluate, compare, contact, and track suppliers without a credit card. Buyer participation creates the network.':'Claim and manage your profile free. Future subscriptions will add optional analytics and opportunity tools—not better scores or ranking.'}</p></header><div className={`${styles.planGrid} ${role==='builders'?'launch-free-grid':'future-supplier-grid'}`}>{activePlans.map((plan,index)=><article className={`${styles.planCard} ${plan.recommended?styles.recommended:''}`} key={plan.name}>{plan.recommended&&<div className={styles.recommendedLabel}><Zap size={11}/> {plan.eyebrow}</div>}<div className={styles.planTop}><span>0{index+1}</span><h3>{plan.name}</h3><p>{plan.purpose}</p></div><div className={styles.price}>{plan.monthly===null?<strong>Custom</strong>:<><strong>${plan.monthly}</strong><span>/month</span></>}</div><PlanAction role={role} plan={plan}/><div className={styles.features}><b>{plan.future?'PLANNED — NOT YET FOR SALE':"WHAT'S INCLUDED AT LAUNCH"}</b>{plan.features.map(feature=><span key={feature}><Check size={13}/>{feature}</span>)}</div></article>)}</div><div className={styles.assurance}><span><CircleCheckBig size={16}/>Buyers use SourceMetric free</span><span><CircleCheckBig size={16}/>Suppliers participate free</span><span><CircleCheckBig size={16}/>Scores are never pay-to-play</span><a href="#compare">See why SourceMetric is different <ArrowRight size={13}/></a></div></section>

      <section className={styles.comparison} id="compare"><div className={styles.sectionIntro}><span>WHY COMPANIES CHOOSE SOURCEMETRIC</span><h2>Move from scattered knowledge<br/>to supplier intelligence.</h2><p>SourceMetric turns what your teams know—and what suppliers have earned—into a network everyone can act on.</p></div><div className={styles.compareTable}><div className={styles.compareHeader}><span>HOW SUPPLIER DECISIONS GET MADE</span><div><FileSpreadsheet size={18}/><b>Traditional management</b></div><div><Layers3 size={18}/><b>With SourceMetric</b></div></div>{[['Supplier records','Spreadsheet tracking','Centralized network'],['Market visibility','Limited visibility','Verified reputation'],['Decision timing','Reactive decisions','Proactive intelligence'],['Team knowledge','Scattered feedback','Shared performance data'],['Risk detection','After problems occur','Early risk signals'],['Supplier discovery','Referrals and search','Evidence-based matching']].map(([area,oldWay,newWay])=><div className={styles.compareRow} key={area}><span>{area}</span><div><X size={13}/>{oldWay}</div><div><Check size={13}/>{newWay}</div></div>)}</div><div className={styles.outcomeCards}><article><Network size={20}/><strong>One connected network</strong><p>Give procurement, operations, and finance teams the same supplier view.</p></article><article><BarChart3 size={20}/><strong>Decisions backed by evidence</strong><p>Compare performance signals instead of relying on disconnected anecdotes.</p></article><article><TrendingUp size={20}/><strong>Reputation that compounds</strong><p>Help great suppliers turn verified performance into durable market trust.</p></article></div></section>

      <section className={styles.faq} id="faq"><div className={styles.faqIntro}><span>FREQUENTLY ASKED QUESTIONS</span><h2>Clear answers before<br/>you join the network.</h2><p>Have a question about an enterprise rollout?</p><Link href="/signup?role=builder">Request access <ArrowRight size={13}/></Link></div><div className={styles.faqList}>{faqs.map((item,index)=><article className={openFaq===index?styles.openFaq:''} key={item.q}><button onClick={()=>setOpenFaq(openFaq===index?-1:index)}><span>0{index+1}</span><b>{item.q}</b><ChevronDown size={17}/></button>{openFaq===index&&<p>{item.a}</p>}</article>)}</div></section>

      <section className={styles.cta}><div className={styles.ctaGrid}/><BadgeCheck size={24}/><span>BUILD BETTER RELATIONSHIPS</span><h2>Your next trusted partner<br/>is already in the network.</h2><p>Start free today. Build confidence with every supplier decision.</p><div><Link href="/signup?role=builder">I&apos;m a Business <ArrowRight size={15}/></Link><Link href="/signup?role=supplier">I&apos;m a Supplier <ArrowRight size={15}/></Link></div></section>
    </main>

    <footer className={styles.footer}><Brand/><p>Supplier intelligence for better decisions.</p><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><span>© 2026 SourceMetric</span></div></footer>
  </div>;
}
