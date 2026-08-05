import Link from 'next/link';
import {ArrowRight,BadgeCheck,BarChart3,Building2,Check,ChevronRight,ClipboardCheck,Layers3,MapPin,Scale,Search,ShieldCheck,Target,TrendingUp,Users2} from 'lucide-react';
import type {CSSProperties} from 'react';
import {AnimatedScore} from './AnimatedScore';
import {BrandLogo} from '@/components/brand/BrandLogo';
import {MarketingNav} from '@/components/MarketingNav';
import styles from './HomeExperience.module.css';

const scoreRows=[
  {label:'Quality',value:94},
  {label:'Reliability',value:92},
  {label:'Delivery',value:88},
  {label:'Pricing / Value',value:87},
  {label:'Service',value:93},
];

function Brand(){return <BrandLogo variant="horizontal" size="md" className={styles.brand}/>;}

function IntelligenceCard(){return <div className={styles.intelligenceStage} aria-label="Illustrative SourceMetric supplier intelligence preview">
  <div className={styles.gridPlane}/>
  <div className={`${styles.floatBadge} ${styles.badgeVerified}`}><BadgeCheck size={16}/><span><b>Profile status</b><small>Shown transparently</small></span></div>
  <div className={`${styles.floatBadge} ${styles.badgeTrend}`}><TrendingUp size={16}/><span><b>Performance signal</b><small>Structured across key metrics</small></span></div>
  <article className={styles.intelligenceCard}>
    <header className={styles.cardHeader}><div className={styles.companyIcon}><Building2 size={22}/></div><div><span className={styles.overline}>FICTIONAL PRODUCT PREVIEW</span><h2>Atlas Packaging Group</h2><p><MapPin size={13}/> Midwest service region</p></div><span className={styles.liveDot}>DEMO</span></header>
    <div className={styles.scorePanel}><div className={styles.mainScore}><small>SOURCEMETRIC SCORE</small><strong><AnimatedScore value={91}/></strong><span>Strong performance</span></div><div className={styles.scoreDial}><div/><span>91</span></div></div>
    <div className={styles.scoreRows}>{scoreRows.map(row=><div className={styles.scoreRow} key={row.label}><span>{row.label}</span><div className={styles.scoreTrack}><i style={{'--score':`${row.value}%`} as CSSProperties}/></div><b><AnimatedScore value={row.value}/></b></div>)}</div>
    <footer className={styles.cardFooter}><span><ShieldCheck size={16}/><b>Structured performance view</b></span><span>Illustrative data</span></footer>
  </article>
  <div className={styles.miniPanel}><span>PERFORMANCE SIGNAL</span><div className={styles.sparkline}>{[48,55,53,67,72,81,91].map((height,index)=><i key={index} style={{height:`${height}%`}}/>)}</div><b>Improving</b></div>
</div>;}

const businessFeatures=[
  {icon:Search,title:'Find relevant suppliers',text:'Search by category, location, capabilities, service area, and performance data.',href:'/marketplace',action:'Explore suppliers'},
  {icon:Scale,title:'Compare what matters',text:'Review supplier performance across quality, reliability, delivery, value, and service.',href:'/marketplace',action:'Compare supplier profiles'},
  {icon:Target,title:'Track your network',text:'Save suppliers, document evaluations, and identify performance risks in one workspace.',href:'/signup?role=builder',action:'Create a business workspace'},
];

const supplierFeatures=[
  {number:'01',title:'Maintain an accurate profile',text:'Present your company, capabilities, service area, and work clearly.',href:'/signup?role=supplier'},
  {number:'02',title:'Understand buyer feedback',text:'See how customers evaluate quality, delivery, reliability, and service.',href:'/pricing#plans'},
  {number:'03',title:'Build credible visibility',text:'Help purchasing teams discover your business using useful supplier information.',href:'/marketplace'},
];

export function HomeExperience({viewer}:{viewer:{name:string|null;role:string;dashboard:string}|null}){return <div className={styles.page}>
  <MarketingNav viewer={viewer?{name:viewer.name,dashboard:viewer.dashboard}:null}/>

  <main>
    <section className={styles.hero}><div className={styles.heroCopy}><div className={styles.eyebrow}><span/><span>SUPPLIER INTELLIGENCE, SIMPLIFIED</span></div><h1>Make better<br/><em>supplier decisions.</em></h1><p>Find, evaluate, and compare suppliers using performance metrics that matter to your business.</p><div className={styles.heroActions}><Link className={styles.primaryButton} href="/marketplace"><Search size={18}/>Explore suppliers<ArrowRight size={17}/></Link><Link data-analytics-event="signup_click" data-analytics-destination="business" className={styles.secondaryButton} href={viewer?viewer.dashboard:'/signup'}><Users2 size={18}/>{viewer?'Open my workspace':'Get started'}<ArrowRight size={17}/></Link></div><div className={styles.trustLine}><span><Check size={14}/>Structured performance metrics</span><span><Check size={14}/>Transparent profile status</span><span><Check size={14}/>No pay-to-play scores</span></div></div><IntelligenceCard/></section>

    <section className={styles.signalStrip} id="how-it-works" aria-label="How SourceMetric works"><span>FIND SUPPLIERS</span><i/><span>EVALUATE PERFORMANCE</span><i/><span>COMPARE OPTIONS</span><i/><span>TRACK RESULTS</span></section>

    <section className={styles.builderSection} id="businesses"><div className={styles.sectionIntro}><div><span className={styles.sectionIndex}>01 / FOR BUSINESSES</span><h2>Supplier decisions deserve better data.</h2></div><p>SourceMetric gives purchasing and operations teams a consistent way to discover suppliers, assess performance, and preserve what the organization learns.</p></div><div className={styles.featureGrid}>{businessFeatures.map(({icon:Icon,title,text,href,action},index)=><Link href={href} className={styles.featureCard} key={title}><div className={styles.featureTop}><span>0{index+1}</span><Icon size={22}/></div><h3>{title}</h3><p>{text}</p><span className={styles.featureLink}>{action} <ChevronRight size={15}/></span></Link>)}</div><div className={styles.builderConsole}><div className={styles.consoleCopy}><span className={styles.kicker}>YOUR SUPPLIER NETWORK</span><h3>A clearer view of supplier performance.</h3><p>Bring saved suppliers, buyer evaluations, score trends, and risk signals into one practical workspace.</p><Link href={viewer?viewer.dashboard:'/signup?role=builder'}>{viewer?'Open your workspace':'Create a business workspace'} <ArrowRight size={16}/></Link></div><div className={styles.metricBoard}><div className={styles.boardHeader}><span>NETWORK OVERVIEW</span><small>LIVE ACCOUNT DATA</small></div><div className={styles.boardMetrics}><div><small>Network health</small><strong>Live</strong><span>Based on saved suppliers</span></div><div><small>Tracked suppliers</small><strong>Yours</strong><span>Organized in one place</span></div><div><small>Evaluations</small><strong>Useful</strong><span>Submitted by buyers</span></div></div><div className={styles.riskRow}><span><ShieldCheck size={18}/></span><div><b>Performance risk review</b><small>Signals develop as your network grows</small></div><div className={styles.riskBar}><i/></div><b>PRO</b></div></div></div></section>

    <section className={styles.supplierSection} id="suppliers"><div className={styles.supplierAside}><span className={styles.sectionIndex}>02 / FOR SUPPLIERS</span><h2>Make your performance easier to understand.</h2><p>Maintain accurate company information, showcase capabilities, and learn from structured customer feedback.</p><div className={styles.reputationStamp}><BarChart3 size={18}/><span><small>PROFILE COMPLETION</small><b><AnimatedScore value={88} suffix="%"/></b></span></div></div><div className={styles.supplierSteps}>{supplierFeatures.map(feature=><Link href={feature.href} key={feature.number}><article><span>{feature.number}</span><div><h3>{feature.title}</h3><p>{feature.text}</p></div><ArrowRight size={18}/></article></Link>)}</div></section>

    <section className={styles.proofSection}><div><ClipboardCheck size={26}/><span><b>Structured evaluation</b><small>Move beyond price-only decisions and generic ratings.</small></span></div><div><Layers3 size={26}/><span><b>Comparable supplier profiles</b><small>Review consistent information across potential partners.</small></span></div><div><BarChart3 size={26}/><span><b>Performance intelligence</b><small>Turn buyer experience into better future decisions.</small></span></div></section>

    <section className={styles.cta}><div className={styles.ctaGrid}/><span className={styles.kicker}>BETTER SUPPLIER DATA. BETTER DECISIONS.</span><h2>Build a supplier network<br/>your team can understand.</h2><p>Start with discovery. Add performance intelligence as your network grows.</p><div><Link className={styles.lightButton} href={viewer?viewer.dashboard:'/signup'}>{viewer?'Return to dashboard':'Get started'} <ArrowRight size={17}/></Link><Link className={styles.textButton} href="/marketplace">Explore suppliers</Link></div></section>
  </main>

  <footer className={styles.footer}><Brand/><p>Supplier intelligence for better business decisions.</p><div><Link href="/marketplace">Suppliers</Link><Link href="/demo">Product tour</Link><a href="#businesses">For businesses</a><a href="#suppliers">For suppliers</a><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><span>© 2026 SourceMetric</span></div></footer>
</div>;}
