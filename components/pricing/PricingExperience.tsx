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
  Sparkles,
  TrendingUp,
  Users2,
  X,
  Zap,
} from 'lucide-react';
import {useState} from 'react';
import styles from './PricingExperience.module.css';

type Role='builders'|'suppliers';
type Plan={name:string;monthly:number|null;yearly:number|null;purpose:string;features:string[];recommended?:boolean;eyebrow?:string};

const plans:Record<Role,Plan[]>={
  builders:[
    {name:'Free',monthly:0,yearly:0,purpose:'Explore the supplier network and start building your shortlist.',features:['Browse construction suppliers','View basic supplier profiles','Save up to 5 suppliers','10 supplier searches per month','Basic TradeStak scores']},
    {name:'Pro',monthly:299,yearly:239,purpose:'Give your procurement team the intelligence to select better partners.',recommended:true,eyebrow:'RECOMMENDED FOR BUILDERS',features:['Unlimited supplier searches','Full supplier intelligence','Side-by-side comparisons','Network health dashboard','Real-time risk alerts','Project supplier tracking','Advanced analytics','Up to 10 team members']},
    {name:'Enterprise',monthly:null,yearly:null,purpose:'Standardize supplier intelligence across markets, divisions, and teams.',features:['Unlimited users','Multi-market visibility','Custom reporting','API access','Dedicated success manager','Enterprise onboarding','Custom security review']},
  ],
  suppliers:[
    {name:'Claim Free',monthly:0,yearly:0,purpose:'Own your company presence and keep your essential information current.',features:['Claim company profile','Add company information','Basic marketplace visibility','Respond to builder reviews','Manage service details']},
    {name:'Verified',monthly:99,yearly:79,purpose:'Turn proven performance into a reputation builders can trust.',recommended:true,eyebrow:'BEST FOR GROWTH',features:['Verified supplier badge','Enhanced company profile','Performance analytics','Builder discovery boost','Lead and search insights','Reputation tracking','Profile optimization tools']},
    {name:'Premium',monthly:249,yearly:199,purpose:'Win more visibility with deeper market and competitive intelligence.',features:['Priority marketplace visibility','Advanced performance analytics','Competitive insights','Lead generation tools','Marketing profile enhancements','Multi-location profiles','Priority support']},
  ],
};

const faqs=[
  {q:'What is TradeStak?',a:'TradeStak is the reputation intelligence network for construction. Builders use it to discover and evaluate suppliers, while suppliers use it to prove performance and grow their visibility.'},
  {q:'Who uses TradeStak?',a:'TradeStak is designed for construction builders, purchasing teams, suppliers, distributors, manufacturers, and trade partners who need better information before starting a business relationship.'},
  {q:'Can suppliers claim their profile?',a:'Yes. Suppliers can claim an existing profile for free, verify company ownership, update core details, and respond to verified builder feedback.'},
  {q:'Does TradeStak replace procurement software?',a:'No. TradeStak complements procurement and ERP systems by adding supplier reputation, performance intelligence, discovery, and network insights before and between transactions.'},
  {q:'Can I cancel anytime?',a:'Yes. Monthly plans can be canceled at any time. Annual plans remain active through the end of the prepaid term.'},
];

function Brand(){return <Link className={styles.brand} href="/"><span><Layers3 size={19}/></span>Trade<em>Stak</em></Link>}

export function PricingExperience(){
  const [role,setRole]=useState<Role>('builders');
  const [annual,setAnnual]=useState(false);
  const [openFaq,setOpenFaq]=useState(0);
  const [menuOpen,setMenuOpen]=useState(false);
  const activePlans=plans[role];

  return <div className={styles.page}>
    <header className={styles.nav}><Brand/><nav className={menuOpen?styles.menuOpen:''}><Link href="/marketplace">Supplier network</Link><a href="#plans">Plans</a><a href="#compare">Why TradeStak</a><a href="#faq">FAQ</a></nav><div className={styles.navActions}><Link href="/login">Sign in</Link><Link href="/signup">Get started <ArrowRight size={14}/></Link><button onClick={()=>setMenuOpen(v=>!v)} aria-label="Toggle navigation">{menuOpen?<X size={20}/>:<Menu size={20}/>}</button></div></header>

    <main>
      <section className={styles.hero}><div className={styles.heroGrid}/><div className={styles.heroContent}><div className={styles.eyebrow}><Sparkles size={14}/>PRICING BUILT AROUND YOUR ROLE</div><h1>Choose the TradeStak experience<br/><em>that fits your role.</em></h1><p>Start free. Upgrade when your team needs deeper supplier intelligence, stronger visibility, or more ways to grow.</p><div className={styles.roleSwitch}><button className={role==='builders'?styles.activeRole:''} onClick={()=>setRole('builders')}><HardHat size={17}/><span><b>Builders & Buyers</b><small>Discover and manage suppliers</small></span></button><button className={role==='suppliers'?styles.activeRole:''} onClick={()=>setRole('suppliers')}><Building2 size={17}/><span><b>Suppliers & Trade Partners</b><small>Build reputation and visibility</small></span></button></div><div className={styles.billingToggle}><span className={!annual?styles.activePeriod:''}>Monthly</span><button onClick={()=>setAnnual(v=>!v)} className={annual?styles.toggleOn:''} aria-label="Toggle annual billing"><i/></button><span className={annual?styles.activePeriod:''}>Yearly</span><b>Save 20%</b></div></div><aside className={styles.heroProof}><ShieldCheck size={22}/><span>REPUTATION, NOT PAY-TO-PLAY</span><h3>Better plans unlock better intelligence—not better scores.</h3><p>TradeStak performance scores are always based on verified builder feedback.</p></aside></section>

      <section className={styles.plansSection} id="plans"><header><div><span>{role==='builders'?'BUILDERS & BUYERS':'SUPPLIERS & TRADE PARTNERS'}</span><h2>{role==='builders'?'Build your supplier network with confidence.':'Make your reputation visible.'}</h2></div><p>{role==='builders'?'From exploring the market to managing supplier risk across every division.':'Start with your profile, then unlock the tools that turn strong performance into growth.'}</p></header><div className={styles.planGrid}>{activePlans.map((plan,index)=><article className={`${styles.planCard} ${plan.recommended?styles.recommended:''}`} key={plan.name}>{plan.recommended&&<div className={styles.recommendedLabel}><Zap size={11}/> {plan.eyebrow}</div>}<div className={styles.planTop}><span>0{index+1}</span><h3>{plan.name}</h3><p>{plan.purpose}</p></div><div className={styles.price}>{plan.monthly===null?<strong>Custom</strong>:<><strong>${annual?plan.yearly:plan.monthly}</strong><span>/month</span></>} {annual&&plan.monthly!==null&&plan.monthly>0&&<small>Billed annually</small>}</div><Link className={styles.planButton} href={role==='builders'?'/signup?role=builder':'/signup?role=supplier'}>{role==='builders'?'Start Building Smarter':'Claim Your Profile'} <ArrowRight size={14}/></Link><div className={styles.features}><b>WHAT&apos;S INCLUDED</b>{plan.features.map(feature=><span key={feature}><Check size={13}/>{feature}</span>)}</div></article>)}</div><div className={styles.assurance}><span><CircleCheckBig size={16}/>No setup fees</span><span><CircleCheckBig size={16}/>Cancel anytime</span><span><CircleCheckBig size={16}/>Scores are never pay-to-play</span><a href="#compare">Compare every feature <ArrowRight size={13}/></a></div></section>

      <section className={styles.comparison} id="compare"><div className={styles.sectionIntro}><span>WHY COMPANIES CHOOSE TRADESTAK</span><h2>Move from scattered knowledge<br/>to supplier intelligence.</h2><p>TradeStak turns what your teams know—and what suppliers have earned—into a network everyone can act on.</p></div><div className={styles.compareTable}><div className={styles.compareHeader}><span>HOW SUPPLIER DECISIONS GET MADE</span><div><FileSpreadsheet size={18}/><b>Traditional management</b></div><div><Layers3 size={18}/><b>With TradeStak</b></div></div>{[['Supplier records','Spreadsheet tracking','Centralized network'],['Market visibility','Limited visibility','Verified reputation'],['Decision timing','Reactive decisions','Proactive intelligence'],['Team knowledge','Scattered feedback','Shared performance data'],['Risk detection','After problems occur','Early risk signals'],['Supplier discovery','Referrals and search','Evidence-based matching']].map(([area,oldWay,newWay])=><div className={styles.compareRow} key={area}><span>{area}</span><div><X size={13}/>{oldWay}</div><div><Check size={13}/>{newWay}</div></div>)}</div><div className={styles.outcomeCards}><article><Network size={20}/><strong>One connected network</strong><p>Give procurement, operations, and project teams the same supplier view.</p></article><article><BarChart3 size={20}/><strong>Decisions backed by evidence</strong><p>Compare performance signals instead of relying on disconnected anecdotes.</p></article><article><TrendingUp size={20}/><strong>Reputation that compounds</strong><p>Help great suppliers turn verified performance into durable market trust.</p></article></div></section>

      <section className={styles.faq} id="faq"><div className={styles.faqIntro}><span>FREQUENTLY ASKED QUESTIONS</span><h2>Clear answers before<br/>you join the network.</h2><p>Have a question about an enterprise rollout?</p><a href="mailto:sales@tradestak.com">Talk with our team <ArrowRight size={13}/></a></div><div className={styles.faqList}>{faqs.map((item,index)=><article className={openFaq===index?styles.openFaq:''} key={item.q}><button onClick={()=>setOpenFaq(openFaq===index?-1:index)}><span>0{index+1}</span><b>{item.q}</b><ChevronDown size={17}/></button>{openFaq===index&&<p>{item.a}</p>}</article>)}</div></section>

      <section className={styles.cta}><div className={styles.ctaGrid}/><BadgeCheck size={24}/><span>BUILD BETTER RELATIONSHIPS</span><h2>Your next trusted partner<br/>is already in the network.</h2><p>Start free today. Build confidence with every supplier decision.</p><div><Link href="/signup?role=builder">I&apos;m a Builder <ArrowRight size={15}/></Link><Link href="/signup?role=supplier">I&apos;m a Supplier <ArrowRight size={15}/></Link></div></section>
    </main>

    <footer className={styles.footer}><Brand/><p>Reputation intelligence for construction.</p><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><span>© 2026 TradeStak</span></div></footer>
  </div>;
}
