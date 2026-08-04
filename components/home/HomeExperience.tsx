import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Check,
  ChevronRight,
  ClipboardCheck,
  Layers3,
  MapPin,
  Menu,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users2,
} from 'lucide-react';
import type {CSSProperties} from 'react';
import {AnimatedScore} from './AnimatedScore';
import {BrandLogo} from '@/components/brand/BrandLogo';
import styles from './HomeExperience.module.css';

const scoreRows=[
  {label:'Quality',value:94},
  {label:'Delivery',value:88},
  {label:'Communication',value:91},
];

function Brand(){
  return <BrandLogo variant="horizontal" size="md" className={styles.brand}/>;
}

function IntelligenceCard(){
  return <div className={styles.intelligenceStage} aria-label="Supplier intelligence preview">
    <div className={styles.gridPlane}/>
    <div className={`${styles.floatBadge} ${styles.badgeVerified}`}><BadgeCheck size={16}/><span><b>Identity verified</b><small>Ownership confirmed</small></span></div>
    <div className={`${styles.floatBadge} ${styles.badgeTrend}`}><TrendingUp size={16}/><span><b>Top 8%</b><small>Regional performance</small></span></div>
    <article className={styles.intelligenceCard}>
      <header className={styles.cardHeader}>
        <div className={styles.companyIcon}><Building2 size={22}/></div>
        <div><span className={styles.overline}>CONCRETE · NORTH ALABAMA</span><h2>Northline Concrete Co.</h2><p><MapPin size={13}/> Athens, Alabama</p></div>
        <span className={styles.liveDot}>LIVE</span>
      </header>
      <div className={styles.scorePanel}>
        <div className={styles.mainScore}><small>TRADESTAK SCORE</small><strong><AnimatedScore value={92}/></strong><span>Excellent</span></div>
        <div className={styles.scoreDial}><div/><span>92</span></div>
      </div>
      <div className={styles.scoreRows}>
        {scoreRows.map(row=><div className={styles.scoreRow} key={row.label}><span>{row.label}</span><div className={styles.scoreTrack}><i style={{'--score':`${row.value}%`} as CSSProperties}/></div><b><AnimatedScore value={row.value}/></b></div>)}
      </div>
      <footer className={styles.cardFooter}><span><ShieldCheck size={16}/><b>38 verified evaluations</b></span><span>Updated today</span></footer>
    </article>
    <div className={styles.miniPanel}><span>NETWORK SIGNAL</span><div className={styles.sparkline}>{[42,58,51,72,66,84,92].map((height,index)=><i key={index} style={{height:`${height}%`}}/>)}</div><b>Strengthening</b></div>
  </div>;
}

const builderFeatures=[
  {icon:Search,title:'Discover with evidence',text:'Search beyond names and locations. Compare suppliers using verified performance signals.'},
  {icon:ShieldCheck,title:'Reduce supplier risk',text:'Spot delivery, quality, and communication patterns before they become project problems.'},
  {icon:Radar,title:'See your whole network',text:'Turn scattered team knowledge into a clear, living view of supplier performance.'},
];

const supplierFeatures=[
  {number:'01',title:'Claim your profile',text:'Verify ownership and take control of the company information builders rely on.'},
  {number:'02',title:'Build visible trust',text:'Bring verified evaluations and performance signals into one credible reputation.'},
  {number:'03',title:'Get discovered',text:'Stand out to builders searching for proven partners in your trade and market.'},
];

export function HomeExperience(){
  return <div className={styles.page}>
    <header className={styles.nav}>
      <Brand/>
      <nav aria-label="Primary navigation"><Link href="/marketplace">Marketplace</Link><a href="#builders">For builders</a><a href="#suppliers">For suppliers</a><Link href="/pricing">Pricing</Link><a href="#how-it-works">How it works</a></nav>
      <div className={styles.navActions}><Link href="/login">Sign in</Link><Link className={styles.navButton} href="/signup">Join the network <ArrowRight size={15}/></Link></div>
      <details className="homeMobileMenu"><summary aria-label="Open navigation"><Menu size={21}/></summary><div><Link href="/marketplace">Marketplace</Link><a href="#builders">For builders</a><a href="#suppliers">For suppliers</a><Link href="/pricing">Pricing</Link><a href="#how-it-works">How it works</a><Link href="/login">Sign in</Link></div></details>
    </header>

    <main>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span/><span>THE REPUTATION INTELLIGENCE NETWORK</span></div>
          <h1>Builders discover<br/><em>better suppliers.</em><br/>Suppliers prove<br/><em>their reputation.</em></h1>
          <p>TradeStak brings trusted performance data to the construction supply chain—so every partnership starts with clarity.</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/signup?role=builder"><Building2 size={18}/>I&apos;m a Builder<ArrowRight size={17}/></Link>
            <Link className={styles.secondaryButton} href="/signup?role=supplier"><Users2 size={18}/>I&apos;m a Supplier<ArrowRight size={17}/></Link>
          </div>
          <div className={styles.trustLine}><span><Check size={14}/>Verified evaluations</span><span><Check size={14}/>Built for construction</span><span><Check size={14}/>Evidence, not ads</span></div>
        </div>
        <IntelligenceCard/>
      </section>

      <section className={styles.signalStrip} id="how-it-works" aria-label="TradeStak platform pillars">
        <span>SUPPLIER DISCOVERY</span><i/><span>VERIFIED REPUTATION</span><i/><span>NETWORK INTELLIGENCE</span><i/><span>BETTER BUILDING</span>
      </section>

      <section className={styles.builderSection} id="builders">
        <div className={styles.sectionIntro}><div><span className={styles.sectionIndex}>01 / BUILDERS</span><h2>Know who you&apos;re building with.</h2></div><p>Your team already knows which suppliers perform. TradeStak turns that experience into durable intelligence everyone can use.</p></div>
        <div className={styles.featureGrid}>
          {builderFeatures.map(({icon:Icon,title,text},index)=><article className={styles.featureCard} key={title}><div className={styles.featureTop}><span>0{index+1}</span><Icon size={22}/></div><h3>{title}</h3><p>{text}</p><span className={styles.featureLink}>Explore the network <ChevronRight size={15}/></span></article>)}
        </div>
        <div className={styles.builderConsole}>
          <div className={styles.consoleCopy}><span className={styles.kicker}>YOUR SUPPLIER NETWORK</span><h3>A clearer signal across every trade.</h3><p>Monitor your network at a glance, compare performance, and focus attention where it matters.</p><Link href="/signup?role=builder">Build your TradeStak <ArrowRight size={16}/></Link></div>
          <div className={styles.metricBoard}>
            <div className={styles.boardHeader}><span>NETWORK OVERVIEW</span><small>LAST 90 DAYS</small></div>
            <div className={styles.boardMetrics}><div><small>Network health</small><strong><AnimatedScore value={91}/></strong><span className={styles.up}>↑ 4.2%</span></div><div><small>Tracked suppliers</small><strong><AnimatedScore value={128}/></strong><span>12 trades</span></div><div><small>Verified evaluations</small><strong><AnimatedScore value={346}/></strong><span>28 this month</span></div></div>
            <div className={styles.riskRow}><span><ShieldCheck size={18}/></span><div><b>Low network risk</b><small>3 suppliers need attention</small></div><div className={styles.riskBar}><i/></div><b>82%</b></div>
          </div>
        </div>
      </section>

      <section className={styles.supplierSection} id="suppliers">
        <div className={styles.supplierAside}><span className={styles.sectionIndex}>02 / SUPPLIERS</span><h2>Your reputation should work as hard as you do.</h2><p>Turn reliable service into a reputation builders can see before the first call.</p><div className={styles.reputationStamp}><Sparkles size={18}/><span><small>PROFILE STRENGTH</small><b><AnimatedScore value={88} suffix="%"/></b></span></div></div>
        <div className={styles.supplierSteps}>{supplierFeatures.map(feature=><article key={feature.number}><span>{feature.number}</span><div><h3>{feature.title}</h3><p>{feature.text}</p></div><ArrowRight size={18}/></article>)}</div>
      </section>

      <section className={styles.proofSection}>
        <div><ClipboardCheck size={26}/><span><b>Built around verified work</b><small>Performance evidence from real builder relationships.</small></span></div>
        <div><BarChart3 size={26}/><span><b>Designed for better decisions</b><small>Clear signals without pay-to-play rankings.</small></span></div>
        <div><Users2 size={26}/><span><b>One connected network</b><small>Builders and suppliers aligned around trust.</small></span></div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaGrid}/><span className={styles.kicker}>BUILD BETTER RELATIONSHIPS</span><h2>The strongest projects start<br/>with the right partners.</h2><p>Join the reputation intelligence network built for construction.</p><div><Link className={styles.lightButton} href="/signup">Join TradeStak <ArrowRight size={17}/></Link><Link className={styles.textButton} href="/marketplace">Explore the supplier network</Link></div>
      </section>
    </main>

    <footer className={styles.footer}><Brand/><p>Reputation intelligence for construction.</p><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><span>© 2026 TradeStak</span></div></footer>
  </div>;
}
