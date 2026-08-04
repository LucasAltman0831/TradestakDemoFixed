'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Eye,
  FileBadge,
  Gauge,
  Layers3,
  MapPin,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserRoundSearch,
  Users2,
  X,
} from 'lucide-react';
import {useState} from 'react';
import styles from './SupplierDashboardExperience.module.css';
import {BrandLogo} from '@/components/brand/BrandLogo';
import {ScoreExplanation} from '@/components/brand/ReputationUI';

const navItems=[
  {label:'Dashboard',icon:Gauge,active:true},
  {label:'Company Profile',icon:Building2,completion:'82%'},
  {label:'Performance',icon:BarChart3},
  {label:'Reviews',icon:Star,badge:'38'},
  {label:'Opportunities',icon:BriefcaseBusiness,badge:'7'},
  {label:'Messages',icon:MessageSquare,badge:'3'},
];

const feedback=[
  {builder:'Regional Home Builder',initials:'RH',project:'The Grove · Residential Development',date:'Jul 28, 2026',quality:5,communication:5,delivery:4,quote:'Northline was proactive from pour scheduling through final delivery. Their team kept every phase moving.'},
  {builder:'Harrison & Alder Construction',initials:'HA',project:'Alder Creek · 84 Homes',date:'Jul 16, 2026',quality:5,communication:4,delivery:5,quote:'Consistent quality and dependable dispatch. One of the strongest partners in our North Alabama network.'},
];

const performance=[
  {label:'Quality',score:95,change:'+3.1',benchmark:88},
  {label:'Delivery',score:89,change:'+1.8',benchmark:84},
  {label:'Communication',score:93,change:'+4.2',benchmark:86},
  {label:'Responsiveness',score:94,change:'+2.4',benchmark:87},
];

function Brand(){return <BrandLogo variant="mark" size="md" className={styles.brand}/>}

function Stars({count}:{count:number}){return <span className={styles.stars} aria-label={`${count} out of 5 stars`}>{Array.from({length:5},(_,index)=><Star key={index} size={11} fill={index<count?'currentColor':'none'}/>)}</span>}

export function SupplierDashboardExperience(){
  const [mobileNav,setMobileNav]=useState(false);
  const [noticeOpen,setNoticeOpen]=useState(false);
  const [feedbackTab,setFeedbackTab]=useState<'Recent'|'Top rated'>('Recent');

  return <div className={styles.dashboard}>
    <aside className={`${styles.sidebar} ${mobileNav?styles.sidebarOpen:''}`}>
      <div className={styles.sidebarTop}><Brand/><button onClick={()=>setMobileNav(false)} className={styles.mobileClose} aria-label="Close navigation"><X size={20}/></button></div>
      <div className={styles.companySwitch}><span>NC</span><div><b>Northline Concrete</b><small>Supplier workspace</small></div><ChevronDown size={14}/></div>
      <nav aria-label="Supplier navigation">{navItems.map(({label,icon:Icon,active,badge,completion})=><a className={active?styles.activeNav:''} href="#" key={label}><Icon size={17}/><span>{label}</span>{badge&&<small>{badge}</small>}{completion&&<em>{completion}</em>}</a>)}</nav>
      <div className={styles.sidebarDivider}/>
      <nav><a href="#"><CircleDollarSign size={17}/><span>Billing</span><small className={styles.pro}>PRO</small></a><a href="#"><Settings size={17}/><span>Settings</span></a></nav>
      <div className={styles.visibilityCard}><div><Eye size={14}/><span>PROFILE VISIBILITY</span></div><strong>High</strong><p>Your profile appeared in 46 builder searches this month.</p><a href="#opportunities">View visibility insights <ChevronRight size={13}/></a></div>
      <div className={styles.sidebarProfile}><span>LA</span><div><b>Lucas Altman</b><small>Account owner</small></div><MoreHorizontal size={17}/></div>
    </aside>
    {mobileNav&&<button className={styles.scrim} onClick={()=>setMobileNav(false)} aria-label="Close navigation overlay"/>}

    <div className={styles.mainShell}>
      <header className={styles.topbar}><button onClick={()=>setMobileNav(true)} className={styles.mobileMenu} aria-label="Open navigation"><Menu size={21}/></button><div className={styles.breadcrumb}><Building2 size={15}/><span>Northline Concrete Co.</span><ChevronRight size={12}/><b>Dashboard</b></div><div className={styles.topActions}><button className={styles.searchButton}><Search size={15}/><span>Search</span><kbd>⌘ K</kbd></button><div className={styles.noticeWrap}><button className={styles.noticeButton} onClick={()=>setNoticeOpen(v=>!v)} aria-label="Notifications"><Bell size={17}/><i/></button>{noticeOpen&&<div className={styles.noticeMenu}><b>New activity</b><p>3 builders viewed your profile today.</p><p>You received a new verified evaluation.</p></div>}</div><button className={styles.profileButton}><span>LA</span><ChevronDown size={13}/></button></div></header>

      <main className={styles.content}>
        <section className={styles.welcome}><div><div className={styles.statusLine}><span><ShieldCheck size={13}/>VERIFIED SUPPLIER</span><i/> <b>Profile 82% complete</b></div><h1>Your reputation is working.</h1><p>Northline Concrete Co. is gaining visibility with builders across North Alabama.</p></div><div className={styles.headerActions}><button className={styles.secondaryButton}><Eye size={15}/>View public profile</button><button className={styles.primaryButton}>Improve profile <ArrowRight size={15}/></button></div></section>

        <section className={styles.metrics} aria-label="Supplier overview">
          <article className={styles.scoreMetric}><div className={styles.metricLabel}><span><Award size={15}/>TradeStak Score</span><small>TOP 8% REGIONALLY</small></div><div className={styles.mainScore}><strong>92<small>/100</small></strong><div><span><TrendingUp size={12}/>3.4 pts</span><small>vs. last quarter</small></div></div><div className={styles.scoreScale}><i/><b style={{left:'92%'}}/></div><p>Excellent reputation strength</p></article>
          <article><div className={styles.metricLabel}><span><Eye size={15}/>Profile Views</span><small>30 DAYS</small></div><div className={styles.metricValue}><strong>246</strong><span><TrendingUp size={12}/>18%</span></div><div className={styles.miniChart}>{[34,48,42,58,51,68,63,76,82,79,91,100].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div><p>38 views this week</p></article>
          <article><div className={styles.metricLabel}><span><Users2 size={15}/>Builder Saves</span><small>ALL TIME</small></div><div className={styles.metricValue}><strong>18</strong><span><TrendingUp size={12}/>4</span></div><div className={styles.savedFaces}><i>HA</i><i>RB</i><i>SM</i><i>+15</i></div><p>4 new saves this month</p></article>
          <article className={styles.opportunityMetric}><div className={styles.metricLabel}><span><Target size={15}/>Active Opportunities</span><small>YOUR MARKET</small></div><div className={styles.metricValue}><strong>7</strong><span className={styles.warm}>High intent</span></div><div className={styles.opportunityLine}><i><Sparkles size={12}/></i><span>3 new this week</span></div><p>Estimated $1.2M supplier demand</p></article>
        </section>
        <div className="scoreMethod"><ScoreExplanation compact/></div>

        <section className={styles.layoutGrid}>
          <div className={styles.primaryColumn}>
            <section className={styles.performanceCard}>
              <header><div><span>PERFORMANCE INTELLIGENCE</span><h2>Your reputation performance</h2><p>Based on 38 verified builder evaluations.</p></div><select aria-label="Performance period"><option>Last 12 months</option><option>Last 90 days</option></select></header>
              <div className={styles.performanceBody}><div className={styles.overallScore}><div className={styles.scoreRing}><div><strong>92</strong><small>OVERALL</small></div></div><span><TrendingUp size={13}/>+3.4</span><p>Stronger than 92% of concrete suppliers in your region.</p></div><div className={styles.performanceRows}>{performance.map(row=><div key={row.label}><div><b>{row.label}</b><span>{row.change}<TrendingUp size={10}/></span></div><div className={styles.performanceBar}><i style={{width:`${row.score}%`}}/><em style={{left:`${row.benchmark}%`}}/></div><footer><strong>{row.score}</strong><small>Regional avg. {row.benchmark}</small></footer></div>)}</div></div>
              <div className={styles.trendPanel}><div><span>SCORE TREND</span><b>12-month performance</b></div><div className={styles.trendBars}>{[68,71,70,75,77,80,79,84,86,89,90,92].map((h,i)=><i key={i} style={{height:`${h}%`}}><span/></i>)}</div><div className={styles.trendLegend}><span>SEP</span><span>DEC</span><span>MAR</span><span>AUG</span></div></div>
            </section>

            <section className={styles.feedbackCard}>
              <header><div><span>BUILDER FEEDBACK</span><h2>Verified evaluations</h2></div><div className={styles.tabs}>{(['Recent','Top rated'] as const).map(tab=><button className={feedbackTab===tab?styles.activeTab:''} onClick={()=>setFeedbackTab(tab)} key={tab}>{tab}</button>)}</div></header>
              <div className={styles.feedbackList}>{(feedbackTab==='Recent'?feedback:[...feedback].reverse()).map(review=><article key={review.builder}><div className={styles.reviewHeader}><span>{review.initials}</span><div><b>{review.builder}<ShieldCheck size={13}/></b><small>{review.project}</small></div><time>{review.date}</time></div><p>“{review.quote}”</p><div className={styles.ratings}><span>Quality <Stars count={review.quality}/></span><span>Communication <Stars count={review.communication}/></span><span>Delivery <Stars count={review.delivery}/></span></div></article>)}</div>
              <button className={styles.fullButton}>View all 38 evaluations <ChevronRight size={14}/></button>
            </section>
          </div>

          <aside className={styles.rightRail}>
            <section className={styles.profileCard}><div className={styles.coverPattern}/><div className={styles.companyMark}>NC</div><div className={styles.verifiedBadge}><ShieldCheck size={13}/>Verified</div><h2>Northline Concrete Co.</h2><p>Concrete supplier</p><div className={styles.profileFacts}><span><MapPin size={14}/><div><small>LOCATION</small><b>Athens, Alabama</b></div></span><span><Clock3 size={14}/><div><small>IN BUSINESS</small><b>15 years</b></div></span><span><Target size={14}/><div><small>SERVICE AREA</small><b>North Alabama</b></div></span></div><div className={styles.profileTags}><span>Ready-mix</span><span>Residential</span><span>Commercial</span></div><button className={styles.fullButton}>Edit company profile <ChevronRight size={14}/></button></section>

            <section className={styles.optimizationCard}><header><div><span>PROFILE STRENGTH</span><h2>82%</h2></div><div className={styles.strengthRing}><span>82</span></div></header><div className={styles.strengthBar}><i/></div><p>Complete these items to improve your visibility.</p><div className={styles.tasks}><button><span><Camera size={14}/></span><div><b>Add project photos</b><small>+8% profile strength</small></div><ChevronRight size={14}/></button><button><span><FileBadge size={14}/></span><div><b>Verify certifications</b><small>+6% profile strength</small></div><ChevronRight size={14}/></button><button><span><MapPin size={14}/></span><div><b>Add service areas</b><small>+4% profile strength</small></div><ChevronRight size={14}/></button></div></section>

            <section className={styles.opportunitiesCard} id="opportunities"><header><div><span>MARKET OPPORTUNITIES</span><h2>Builders are looking</h2></div><Sparkles size={18}/></header><div className={styles.opportunityHero}><strong>3</strong><p>builders searched for <b>concrete suppliers near Huntsville</b> this week.</p></div><div className={styles.demandStats}><span><small>SEARCH DEMAND</small><b>+24%</b></span><span><small>PROFILE MATCH</small><b>96%</b></span></div><button className={styles.ctaButton}>View opportunities <ArrowRight size={14}/></button></section>

            <section className={styles.activityCard}><header><span>RECENT ACTIVITY</span><button><MoreHorizontal size={16}/></button></header>{[{icon:Eye,text:'Harrison & Alder viewed your profile',time:'24m ago'},{icon:Users2,text:'You were saved by a regional builder',time:'Yesterday'},{icon:ClipboardCheck,text:'New verified evaluation received',time:'Jul 28'}].map(({icon:Icon,text,time})=><div key={text}><span><Icon size={13}/></span><p>{text}<small>{time}</small></p></div>)}</section>
          </aside>
        </section>
      </main>
    </div>
  </div>;
}
