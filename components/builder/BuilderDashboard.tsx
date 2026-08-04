'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  FolderKanban,
  Grid2X2,
  HardHat,
  Layers3,
  MapPin,
  Menu,
  MoreHorizontal,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  TrendingDown,
  TrendingUp,
  Users2,
  X,
} from 'lucide-react';
import {useMemo,useState} from 'react';
import styles from './BuilderDashboard.module.css';

type Supplier={
  id:number;
  name:string;
  initials:string;
  trade:string;
  location:string;
  score:number;
  quality:number;
  delivery:number;
  communication:number;
  evaluations:number;
  verified:boolean;
  accent:string;
  status:string;
};

const suppliers:Supplier[]=[
  {id:1,name:'Northline Concrete Co.',initials:'NC',trade:'Concrete',location:'Athens, AL',score:92,quality:95,delivery:89,communication:93,evaluations:38,verified:true,accent:'#cc8b2b',status:'Preferred'},
  {id:2,name:'Summit Roofing Supply',initials:'SR',trade:'Roofing',location:'Huntsville, AL',score:88,quality:91,delivery:84,communication:89,evaluations:27,verified:true,accent:'#2e6c73',status:'Approved'},
  {id:3,name:'Redstone Plumbing Partners',initials:'RP',trade:'Plumbing',location:'Madison, AL',score:86,quality:90,delivery:82,communication:86,evaluations:22,verified:true,accent:'#6a655c',status:'Approved'},
  {id:4,name:'Tennessee Valley Millwork',initials:'TV',trade:'Millwork',location:'Decatur, AL',score:84,quality:92,delivery:78,communication:83,evaluations:19,verified:true,accent:'#936645',status:'Monitor'},
  {id:5,name:'Forge Electrical Supply',initials:'FE',trade:'Electrical',location:'Birmingham, AL',score:79,quality:83,delivery:76,communication:78,evaluations:14,verified:false,accent:'#7b6c92',status:'New'},
  {id:6,name:'Blue Ridge Drywall',initials:'BR',trade:'Drywall',location:'Florence, AL',score:90,quality:93,delivery:88,communication:90,evaluations:31,verified:true,accent:'#54758f',status:'Recommended'},
];

const navItems=[
  {label:'Dashboard',icon:Grid2X2,active:true},
  {label:'Supplier Network',icon:Users2},
  {label:'Marketplace',icon:Store},
  {label:'Projects',icon:FolderKanban,badge:'6'},
  {label:'Evaluations',icon:ClipboardCheck,badge:'3'},
  {label:'Analytics',icon:BarChart3},
];

const risks=[
  {icon:TrendingDown,tone:'high',title:'Delivery performance decreased',detail:'Tennessee Valley Millwork · down 8 pts',time:'2h ago'},
  {icon:AlertTriangle,tone:'medium',title:'Communication score declining',detail:'Redstone Plumbing · 3 recent signals',time:'Yesterday'},
  {icon:ClipboardCheck,tone:'low',title:'Evaluation needed',detail:'Summit Roofing · Project Alder',time:'Due Fri'},
];

function Brand(){
  return <Link className={styles.brand} href="/"><span><Layers3 size={18}/></span>Trade<em>Stak</em></Link>;
}

function ScoreRing({score,size='large'}:{score:number;size?:'large'|'small'}){
  return <div className={`${styles.scoreRing} ${size==='small'?styles.scoreRingSmall:''}`} style={{'--score':`${score*3.6}deg`} as React.CSSProperties}><div><strong>{score}</strong>{size==='large'&&<small>/100</small>}</div></div>;
}

function SupplierCard({supplier}:{supplier:Supplier}){
  return <article className={styles.supplierCard}>
    <header>
      <div className={styles.supplierIdentity}><span className={styles.supplierLogo} style={{background:supplier.accent}}>{supplier.initials}</span><div><div className={styles.supplierName}><h3>{supplier.name}</h3>{supplier.verified&&<ShieldCheck size={15}/>}</div><p>{supplier.trade}<i/> <MapPin size={11}/>{supplier.location}</p></div></div>
      <button className={styles.iconButton} aria-label={`More options for ${supplier.name}`}><MoreHorizontal size={18}/></button>
    </header>
    <div className={styles.supplierScore}><ScoreRing score={supplier.score}/><div><span>TRADESTAK SCORE</span><b>{supplier.status}</b><small>{supplier.evaluations} verified evaluations</small></div></div>
    <div className={styles.scoreBreakdown}>{[['Quality',supplier.quality],['Delivery',supplier.delivery],['Communication',supplier.communication]].map(([label,value])=><div key={label}><span>{label}</span><b>{value}</b><i><em style={{width:`${value}%`}}/></i></div>)}</div>
    <footer><button><Star size={14}/>Save supplier</button><button className={styles.viewButton}>View profile <ChevronRight size={14}/></button></footer>
  </article>;
}

export function BuilderDashboard(){
  const [mobileNav,setMobileNav]=useState(false);
  const [query,setQuery]=useState('');
  const [trade,setTrade]=useState('All trades');
  const [verified,setVerified]=useState('Any status');
  const [savedTab,setSavedTab]=useState<'Saved'|'Recent'|'Recommended'>('Saved');
  const [noticeOpen,setNoticeOpen]=useState(false);

  const filtered=useMemo(()=>suppliers.filter(s=>{
    const matchesQuery=[s.name,s.trade,s.location].join(' ').toLowerCase().includes(query.toLowerCase());
    const matchesTrade=trade==='All trades'||s.trade===trade;
    const matchesVerified=verified==='Any status'||(verified==='Verified only'?s.verified:!s.verified);
    return matchesQuery&&matchesTrade&&matchesVerified;
  }),[query,trade,verified]);

  const savedRows=savedTab==='Saved'?suppliers.slice(0,4):savedTab==='Recent'?suppliers.slice(2,6):[suppliers[5],suppliers[0],suppliers[1]];

  return <div className={styles.dashboard}>
    <aside className={`${styles.sidebar} ${mobileNav?styles.sidebarOpen:''}`}>
      <div className={styles.sidebarTop}><Brand/><button className={styles.mobileClose} onClick={()=>setMobileNav(false)} aria-label="Close navigation"><X size={20}/></button></div>
      <div className={styles.workspaceSwitch}><span className={styles.workspaceIcon}>HA</span><div><b>Harrison & Alder</b><small>Builder workspace</small></div><ChevronDown size={15}/></div>
      <nav aria-label="Builder navigation">{navItems.map(({label,icon:Icon,active,badge})=><a className={active?styles.activeNav:''} href="#" key={label}><Icon size={17}/><span>{label}</span>{badge&&<small>{badge}</small>}</a>)}</nav>
      <div className={styles.sidebarDivider}/>
      <nav><a href="#"><CircleDollarSign size={17}/><span>Billing</span><small className={styles.proBadge}>PRO</small></a><a href="#"><Settings size={17}/><span>Settings</span></a></nav>
      <div className={styles.networkCard}><div><Sparkles size={15}/><span>NETWORK HEALTH</span></div><strong>91</strong><p>Your supplier network is performing above the regional benchmark.</p><a href="#analytics">View analytics <ChevronRight size={13}/></a></div>
      <div className={styles.sidebarProfile}><span className={styles.avatar}>LA</span><div><b>Lucas Altman</b><small>Procurement Director</small></div><MoreHorizontal size={17}/></div>
    </aside>
    {mobileNav&&<button className={styles.scrim} onClick={()=>setMobileNav(false)} aria-label="Close navigation overlay"/>}

    <div className={styles.mainShell}>
      <header className={styles.topbar}>
        <button className={styles.mobileMenu} onClick={()=>setMobileNav(true)} aria-label="Open navigation"><Menu size={21}/></button>
        <div className={styles.breadcrumb}><HardHat size={16}/><span>Harrison & Alder Construction</span><ChevronRight size={13}/><b>Dashboard</b></div>
        <div className={styles.topbarActions}><button className={styles.quickSearch}><Search size={15}/><span>Search</span><kbd>⌘ K</kbd></button><div className={styles.noticeWrap}><button className={styles.notificationButton} onClick={()=>setNoticeOpen(v=>!v)} aria-label="Notifications"><Bell size={18}/><i/></button>{noticeOpen&&<div className={styles.noticeMenu}><b>Notifications</b><p>3 supplier evaluations are due this week.</p><p>Northline Concrete moved into your top performers.</p></div>}</div><button className={styles.profileButton}><span>LA</span><ChevronDown size={14}/></button></div>
      </header>

      <main className={styles.content}>
        <section className={styles.welcome}>
          <div><p>TUESDAY, AUGUST 4</p><h1>Good morning, Lucas.</h1><span>Here&apos;s what&apos;s happening across your supplier network.</span></div>
          <button className={styles.primaryAction}><Search size={16}/>Discover suppliers</button>
        </section>

        <section className={styles.metrics} aria-label="Network overview">
          <article className={styles.healthMetric}><div className={styles.metricLabel}><span><ShieldCheck size={15}/>Network Health Score</span><small>LAST 90 DAYS</small></div><div className={styles.metricValue}><strong>91<small>/100</small></strong><span><TrendingUp size={13}/>4.2%</span></div><div className={styles.healthBar}><i/></div><p>Excellent · Top 12% of builder networks</p></article>
          <article><div className={styles.metricLabel}><span><Building2 size={15}/>Tracked Suppliers</span></div><div className={styles.metricValue}><strong>128</strong><span><TrendingUp size={13}/>8</span></div><p>Across 12 trade categories</p><div className={styles.miniAvatars}><i>NC</i><i>SR</i><i>RP</i><i>+125</i></div></article>
          <article><div className={styles.metricLabel}><span><ClipboardCheck size={15}/>Active Evaluations</span></div><div className={styles.metricValue}><strong>34</strong><span className={styles.neutral}>3 due</span></div><p>12 completed this month</p><div className={styles.progress}><i/></div></article>
          <article className={styles.riskMetric}><div className={styles.metricLabel}><span><AlertTriangle size={15}/>Risk Signals</span></div><div className={styles.metricValue}><strong>2</strong><span className={styles.warning}>Needs review</span></div><p>1 high · 1 medium priority</p><button>Review risks <ChevronRight size={13}/></button></article>
        </section>

        <section className={styles.dashboardGrid}>
          <div className={styles.primaryColumn}>
            <div className={styles.sectionHeader}><div><p>SUPPLIER INTELLIGENCE</p><h2>Your highest-impact partners</h2></div><button>View network <ChevronRight size={14}/></button></div>
            <div className={styles.intelligenceGrid}>{suppliers.slice(0,3).map(s=><SupplierCard supplier={s} key={s.id}/>)}</div>

            <section className={styles.discovery}>
              <div className={styles.discoveryHeader}><div><p>MARKETPLACE</p><h2>Supplier discovery</h2><span>Find proven partners across your markets.</span></div><span className={styles.networkCount}>2,481 suppliers</span></div>
              <div className={styles.searchRow}><label><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search suppliers, trades, locations..."/></label><select value={trade} onChange={e=>setTrade(e.target.value)} aria-label="Filter by trade"><option>All trades</option>{Array.from(new Set(suppliers.map(s=>s.trade))).map(t=><option key={t}>{t}</option>)}</select><select aria-label="Filter by location"><option>All locations</option><option>North Alabama</option><option>Central Alabama</option></select><select aria-label="Filter by score"><option>Any score</option><option>90+ Excellent</option><option>80+ Strong</option></select><select value={verified} onChange={e=>setVerified(e.target.value)} aria-label="Filter by verification"><option>Any status</option><option>Verified only</option><option>Unverified</option></select></div>
              <div className={styles.discoveryList}>{filtered.slice(0,4).map(s=><article key={s.id}><span className={styles.supplierLogo} style={{background:s.accent}}>{s.initials}</span><div className={styles.discoveryName}><b>{s.name}{s.verified&&<CheckCircle2 size={13}/>}</b><span>{s.trade} · {s.location} · {s.evaluations} evaluations</span></div><div className={styles.inlineScore}><ScoreRing score={s.score} size="small"/><span><b>{s.score}</b><small>TradeStak</small></span></div><div className={styles.discoveryStats}><span>Quality <b>{s.quality}</b></span><span>Delivery <b>{s.delivery}</b></span><span>Comms <b>{s.communication}</b></span></div><button>View profile</button></article>)}{!filtered.length&&<div className={styles.emptyState}>No suppliers match those filters. Try widening your search.</div>}</div>
            </section>
          </div>

          <aside className={styles.rightRail}>
            <section className={styles.riskPanel}><div className={styles.railHeader}><div><span>RISK INTELLIGENCE</span><h2>Potential risks</h2></div><small>2 active</small></div><div>{risks.map(({icon:Icon,tone,title,detail,time})=><article key={title}><span className={`${styles.riskIcon} ${styles[tone]}`}><Icon size={16}/></span><div><b>{title}</b><p>{detail}</p><small>{time}</small></div><ChevronRight size={15}/></article>)}</div><button className={styles.fullButton}>Open risk center <ChevronRight size={14}/></button></section>

            <section className={styles.savedPanel}><div className={styles.railHeader}><div><span>YOUR NETWORK</span><h2>Supplier activity</h2></div></div><div className={styles.tabs}>{(['Saved','Recent','Recommended'] as const).map(tab=><button onClick={()=>setSavedTab(tab)} className={savedTab===tab?styles.activeTab:''} key={tab}>{tab}</button>)}</div><div className={styles.savedList}>{savedRows.map(s=><article key={s.id}><span className={styles.supplierLogo} style={{background:s.accent}}>{s.initials}</span><div><b>{s.name}</b><small>{s.trade} · {s.location}</small></div><span className={styles.savedScore}>{s.score}</span></article>)}</div><button className={styles.fullButton}>View all suppliers <ChevronRight size={14}/></button></section>

            <section className={styles.benchmarkCard} id="analytics"><BarChart3 size={20}/><div><span>REGIONAL BENCHMARK</span><h3>Your network outperforms 88% of builders in North Alabama.</h3><a href="#">View benchmark report <ChevronRight size={13}/></a></div></section>
          </aside>
        </section>
      </main>
    </div>
  </div>;
}
