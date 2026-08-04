'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  Bookmark,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  GitCompareArrows,
  HardHat,
  Layers3,
  MapPin,
  Menu,
  MessageSquare,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  Users2,
  X,
} from 'lucide-react';
import {useEffect,useMemo,useState} from 'react';
import {BrandLogo} from '@/components/brand/BrandLogo';
import {ScoreExplanation} from '@/components/brand/ReputationUI';
import styles from './MarketplaceExperience.module.css';
import {trackEvent} from '@/lib/analytics';

type Supplier={id:number;slug:string;name:string;initials:string;trade:string;location:string;score:number;quality:number;delivery:number;communication:number;value:number;years:number;service:string;projects:number;reviews:number;verified:boolean;accent:string;projectType:string;description:string;certifications:string[]};

const suppliers:Supplier[]=[
  {id:1,slug:'northline-concrete',name:'Northline Concrete Co.',initials:'NC',trade:'Concrete',location:'Athens, Alabama',score:92,quality:95,delivery:89,communication:93,value:90,years:15,service:'North Alabama',projects:184,reviews:38,verified:false,accent:'#1469ff',projectType:'Residential',description:'Residential and light-commercial concrete partner known for dependable dispatch, consistent mix quality, and proactive scheduling.',certifications:['NRMCA Certified','DBE','OSHA Compliant']},
  {id:2,slug:'summit-roofing-supply',name:'Summit Roofing Supply',initials:'SR',trade:'Roofing',location:'Huntsville, Alabama',score:88,quality:91,delivery:84,communication:89,value:87,years:22,service:'Tennessee Valley',projects:267,reviews:27,verified:true,accent:'#376c73',projectType:'Commercial',description:'Full-service roofing material supplier supporting production builders and commercial contractors throughout the Tennessee Valley.',certifications:['ABC Member','GAF Certified','OSHA Compliant']},
  {id:3,slug:'redstone-plumbing-partners',name:'Redstone Plumbing Partners',initials:'RP',trade:'Plumbing',location:'Madison, Alabama',score:86,quality:90,delivery:82,communication:86,value:88,years:12,service:'Huntsville Metro',projects:143,reviews:22,verified:true,accent:'#765a49',projectType:'Residential',description:'Plumbing supply and field coordination partner focused on residential communities and multifamily development.',certifications:['PHCC Member','Licensed Supplier']},
  {id:4,slug:'forge-electrical-supply',name:'Forge Electrical Supply',initials:'FE',trade:'Electrical',location:'Birmingham, Alabama',score:90,quality:93,delivery:88,communication:90,value:86,years:28,service:'Central & North Alabama',projects:411,reviews:46,verified:true,accent:'#65597d',projectType:'Commercial',description:'Regional electrical distributor with deep inventory, project staging, and same-day jobsite delivery capabilities.',certifications:['NECA Partner','ISO 9001']},
  {id:5,slug:'apex-climate-systems',name:'Apex Climate Systems',initials:'AC',trade:'HVAC',location:'Decatur, Alabama',score:84,quality:88,delivery:81,communication:84,value:82,years:9,service:'North Alabama',projects:96,reviews:18,verified:true,accent:'#3f7891',projectType:'Multifamily',description:'HVAC equipment and coordination partner for residential and multifamily construction across North Alabama.',certifications:['NATE Partner','EPA Certified']},
  {id:6,slug:'blue-ridge-framing',name:'Blue Ridge Framing',initials:'BR',trade:'Framing',location:'Florence, Alabama',score:81,quality:86,delivery:78,communication:80,value:84,years:17,service:'Northwest Alabama',projects:215,reviews:16,verified:false,accent:'#55705c',projectType:'Residential',description:'Framing material and labor coordination company serving high-volume residential builders.',certifications:['OSHA Compliant']},
  {id:7,slug:'ironclad-concrete-supply',name:'Ironclad Concrete Supply',initials:'IC',trade:'Concrete',location:'Huntsville, Alabama',score:89,quality:91,delivery:87,communication:88,value:91,years:31,service:'North Alabama',projects:536,reviews:42,verified:true,accent:'#7c6048',projectType:'Infrastructure',description:'Large-scale concrete and aggregate supplier serving commercial, civil, and infrastructure projects.',certifications:['NRMCA Certified','DOT Approved']},
  {id:8,slug:'copperline-electric',name:'Copperline Electric Co.',initials:'CE',trade:'Electrical',location:'Athens, Alabama',score:78,quality:84,delivery:75,communication:77,value:80,years:7,service:'Limestone County',projects:72,reviews:11,verified:false,accent:'#98713f',projectType:'Residential',description:'Growing electrical supply partner specializing in residential communities and custom homes.',certifications:['Licensed Supplier']},
];

const trades=['All trades','Concrete','Electrical','Plumbing','HVAC','Roofing','Framing'];
const exampleSearches=['Concrete contractors','HVAC suppliers','Huntsville Alabama','Roofing partners'];

function Brand(){return <BrandLogo variant="horizontal" size="sm" className={styles.brand}/>}

function ScoreRing({score,small=false}:{score:number;small?:boolean}){return <div className={`${styles.scoreRing} ${small?styles.smallRing:''}`} style={{'--score':`${score*3.6}deg`} as React.CSSProperties}><div><strong>{score}</strong>{!small&&<small>/100</small>}</div></div>}

function SupplierCard({supplier,saved,onSave,onPreview,selected,onCompare}:{supplier:Supplier;saved:boolean;onSave:()=>void;onPreview:()=>void;selected:boolean;onCompare:()=>void}){
  const [expanded,setExpanded]=useState(false);
  return <article className={`${styles.supplierCard} ${expanded?styles.expandedCard:''}`}>
    <header><div className={styles.identity}><span style={{background:supplier.accent}}>{supplier.initials}</span><div><div><h3>{supplier.name}</h3>{supplier.verified&&<BadgeCheck size={15}/>}</div><p>{supplier.trade}<i/> <MapPin size={11}/>{supplier.location}</p></div></div><button onClick={onSave} className={saved?styles.savedButton:''} aria-label={`${saved?'Remove':'Save'} ${supplier.name}`}><Bookmark size={16} fill={saved?'currentColor':'none'}/></button></header>
    <div className={styles.cardScore}><ScoreRing score={supplier.score}/><div><span>TRADESTAK SCORE</span><b>{supplier.score>=90?'Excellent':supplier.score>=85?'Strong':'Established'}</b><small>{supplier.reviews} verified evaluations</small></div><div className={styles.verifiedMark}>{supplier.verified?<><ShieldCheck size={14}/><span>VERIFIED</span></>:<><Building2 size={14}/><span>UNCLAIMED PROFILE</span></>}</div></div>
    <div className={styles.performance}>{[['Quality',supplier.quality],['Delivery',supplier.delivery],['Communication',supplier.communication]].map(([label,value])=><div key={label}><span>{label}</span><b>{value}</b><i><em style={{width:`${value}%`}}/></i></div>)}</div>
    <div className={styles.companyFacts}><span><Clock3 size={13}/><small>IN BUSINESS</small><b>{supplier.years} years</b></span><span><MapPin size={13}/><small>SERVICE AREA</small><b>{supplier.service}</b></span><span><Building2 size={13}/><small>PROJECTS</small><b>{supplier.projects}</b></span></div>
    {expanded&&<div className={styles.expandedPreview}><p>{supplier.description}</p><div>{supplier.certifications.map(c=><span key={c}><Check size={10}/>{c}</span>)}</div><ScoreExplanation compact/></div>}
    <footer><label><input type="checkbox" checked={selected} onChange={onCompare}/>Compare</label><button onClick={()=>setExpanded(v=>!v)}>{expanded?'Less detail':'More detail'} <ChevronDown size={13}/></button><Link className={styles.profileAction} href={`/suppliers/${supplier.slug}`}>View profile <ArrowRight size={13}/></Link></footer>
  </article>;
}

export function MarketplaceExperience(){
  const demoMode=process.env.NEXT_PUBLIC_APP_MODE!=='production';
  const [query,setQuery]=useState('');
  useEffect(()=>{if(query.trim().length<2)return;const timer=window.setTimeout(()=>trackEvent('marketplace_search',{query:query.trim()}),700);return()=>window.clearTimeout(timer)},[query]);
  const [trade,setTrade]=useState('All trades');
  const [location,setLocation]=useState('All locations');
  const [score,setScore]=useState('Any score');
  const [verified,setVerified]=useState(false);
  const [years,setYears]=useState('Any experience');
  const [projectType,setProjectType]=useState('Any project');
  const [filtersOpen,setFiltersOpen]=useState(false);
  const [saved,setSaved]=useState<number[]>([1,4]);
  const [compare,setCompare]=useState<number[]>([]);
  const [preview,setPreview]=useState<Supplier|null>(null);
  const [comparisonOpen,setComparisonOpen]=useState(false);
  const [mobileNav,setMobileNav]=useState(false);

  const filtered=useMemo(()=>(demoMode?suppliers:[]).filter(s=>{
    const text=[s.name,s.trade,s.location,s.service].join(' ').toLowerCase();
    const minScore=score==='90+ excellent'?90:score==='85+ strong'?85:score==='80+ proven'?80:0;
    const minYears=years==='20+ years'?20:years==='10+ years'?10:years==='5+ years'?5:0;
    return text.includes(query.toLowerCase())&&(trade==='All trades'||s.trade===trade)&&(location==='All locations'||s.location.includes(location))&&s.score>=minScore&&(!verified||s.verified)&&s.years>=minYears&&(projectType==='Any project'||s.projectType===projectType);
  }),[demoMode,query,trade,location,score,verified,years,projectType]);

  function toggleCompare(id:number){setCompare(current=>current.includes(id)?current.filter(x=>x!==id):current.length<3?[...current,id]:current)}
  const compared=suppliers.filter(s=>compare.includes(s.id));

  return <div className={styles.marketplace}>
    <header className={styles.topNav}><Brand/><nav className={mobileNav?styles.mobileNavOpen:''}><a className={styles.activeLink} href="#market">Marketplace</a><a href="#saved">Saved Suppliers <small>{saved.length}</small></a><button onClick={()=>setComparisonOpen(true)}>Compare <small>{compare.length}</small></button><a href="#recent">Recently Viewed</a></nav><div className={styles.navActions}><button aria-label="Notifications"><Bell size={17}/><i/></button><span>LA</span><button className={styles.menuButton} onClick={()=>setMobileNav(v=>!v)} aria-label="Toggle navigation"><Menu size={20}/></button></div></header>

    <main id="market">
      <section className={styles.hero}><div className={styles.heroGrid}/><div className={styles.heroContent}><div className={styles.eyebrow}><HardHat size={14}/>THE CONSTRUCTION SUPPLIER NETWORK</div><h1>Find suppliers<br/><em>you can trust.</em></h1><p>Search verified construction partners by trade, location, performance, and reputation.</p><div className={styles.heroSearch}><Search size={21}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search suppliers, trades, locations..."/><button>Search network <ArrowRight size={16}/></button></div><div className={styles.examples}><span>TRY:</span>{exampleSearches.map(example=><button onClick={()=>setQuery(example)} key={example}>{example}</button>)}</div></div><div className={styles.networkPulse}><span>LIVE NETWORK</span><strong>2,481</strong><p>construction suppliers across 37 trades</p><div><i/><span>186 verified this month</span></div></div></section>

      <section className={styles.subNav}><div><a className={styles.activeSub} href="#market"><Store size={14}/>Marketplace</a><a id="saved" href="#saved"><Bookmark size={14}/>Saved suppliers</a><button onClick={()=>setComparisonOpen(true)}><GitCompareArrows size={14}/>Compare suppliers</button><a id="recent" href="#recent"><Clock3 size={14}/>Recently viewed</a></div><span><ShieldCheck size={14}/>Every score is backed by verified builder evaluations.</span></section>

      <div className={styles.content}>
        <aside className={`${styles.filters} ${filtersOpen?styles.filtersOpen:''}`}><header><div><SlidersHorizontal size={15}/><b>Advanced filters</b></div><button onClick={()=>{setTrade('All trades');setLocation('All locations');setScore('Any score');setVerified(false);setYears('Any experience');setProjectType('Any project')}}>Clear all</button></header><label>Trade<select value={trade} onChange={e=>setTrade(e.target.value)}>{trades.map(t=><option key={t}>{t}</option>)}</select></label><label>Location<select value={location} onChange={e=>setLocation(e.target.value)}><option>All locations</option><option>Huntsville</option><option>Athens</option><option>Birmingham</option><option>Madison</option><option>Decatur</option></select></label><label>TradeStak score<select value={score} onChange={e=>setScore(e.target.value)}><option>Any score</option><option>90+ excellent</option><option>85+ strong</option><option>80+ proven</option></select></label><label className={styles.checkLabel}><input type="checkbox" checked={verified} onChange={e=>setVerified(e.target.checked)}/><span><ShieldCheck size={14}/><b>Verified suppliers only</b><small>Ownership and company details confirmed</small></span></label><label>Years in business<select value={years} onChange={e=>setYears(e.target.value)}><option>Any experience</option><option>20+ years</option><option>10+ years</option><option>5+ years</option></select></label><label>Project type<select value={projectType} onChange={e=>setProjectType(e.target.value)}><option>Any project</option><option>Residential</option><option>Commercial</option><option>Multifamily</option><option>Infrastructure</option></select></label><div className={styles.filterInsight}><Sparkles size={15}/><b>Smart Match</b><p>Connect a project to rank suppliers against its trade, location, and schedule.</p><button>Choose a project</button></div></aside>

        <div className={styles.results}><div className={styles.resultsHeader}><div><span>SUPPLIER DISCOVERY</span><h2>{filtered.length} trusted partners</h2><p>Showing suppliers across North Alabama</p></div><div><button className={styles.mobileFilter} onClick={()=>setFiltersOpen(v=>!v)}><SlidersHorizontal size={14}/>Filters</button><select aria-label="Sort suppliers"><option>Best match</option><option>Highest score</option><option>Most reviewed</option><option>Most experience</option></select></div></div><ScoreExplanation compact/>
          <section className={styles.recommended}><header><div><Sparkles size={14}/><span>RECOMMENDED FOR YOUR PROJECTS</span></div><p>Based on your trades, North Alabama location, and recent activity.</p></header><div>{suppliers.slice(0,3).map(s=><button onClick={()=>setPreview(s)} key={s.id}><span style={{background:s.accent}}>{s.initials}</span><div><b>{s.name}</b><small>{s.trade} · {s.location}</small></div><strong>{s.score}</strong><ChevronRight size={14}/></button>)}</div></section>
          <div className={styles.grid}>{filtered.map(s=><SupplierCard key={s.id} supplier={s} saved={saved.includes(s.id)} selected={compare.includes(s.id)} onSave={()=>setSaved(current=>current.includes(s.id)?current.filter(x=>x!==s.id):[...current,s.id])} onCompare={()=>toggleCompare(s.id)} onPreview={()=>setPreview(s)}/>)}</div>{!filtered.length&&<div className={styles.empty}><Search size={28}/><h3>No suppliers match those filters</h3><p>Try a nearby location or lower score threshold.</p></div>}
        </div>
      </div>
    </main>

    {compare.length>0&&<div className={styles.compareTray}><div><GitCompareArrows size={17}/><span><b>Compare suppliers</b><small>Select up to 3 companies</small></span></div><div className={styles.compareCompanies}>{compared.map(s=><span key={s.id}><i style={{background:s.accent}}>{s.initials}</i>{s.name}<button onClick={()=>toggleCompare(s.id)} aria-label={`Remove ${s.name}`}><X size={12}/></button></span>)}{Array.from({length:3-compare.length},(_,i)=><span className={styles.emptySlot} key={i}>+ Add supplier</span>)}</div><button disabled={compare.length<2} onClick={()=>setComparisonOpen(true)}>Compare {compare.length} suppliers <ArrowRight size={14}/></button></div>}

    {preview&&<div className={styles.overlay} onClick={()=>setPreview(null)}><aside className={styles.previewPanel} onClick={e=>e.stopPropagation()}><button className={styles.closePanel} onClick={()=>setPreview(null)} aria-label="Close profile preview"><X size={19}/></button><div className={styles.previewCover}><span style={{background:preview.accent}}>{preview.initials}</span></div><div className={styles.previewBody}><div className={styles.previewTitle}><div><span>{preview.trade.toUpperCase()}</span><h2>{preview.name} {preview.verified&&<BadgeCheck size={17}/>}</h2><p><MapPin size={12}/>{preview.location} · {preview.years} years in business</p></div><ScoreRing score={preview.score}/></div><p className={styles.description}>{preview.description}</p><div className={styles.previewMetrics}>{[['Quality',preview.quality],['Delivery',preview.delivery],['Communication',preview.communication],['Price / value',preview.value]].map(([label,value])=><span key={label}><small>{label}</small><b>{value}</b><i><em style={{width:`${value}%`}}/></i></span>)}</div><section><h3>Verified builder feedback</h3><article className={styles.review}><div><span>HA</span><b>Harrison & Alder Construction</b><Stars count={5}/></div><p>“Consistent quality, dependable dispatch, and excellent communication across every phase.”</p><small>Residential Development · Verified July 2026</small></article></section><section><h3>Service & credentials</h3><div className={styles.detailGrid}><span><small>SERVICE AREA</small><b>{preview.service}</b></span><span><small>PROJECTS COMPLETED</small><b>{preview.projects}</b></span></div><div className={styles.certifications}>{preview.certifications.map(c=><span key={c}><CheckCircle2 size={12}/>{c}</span>)}</div></section><div className={styles.previewActions}><button><MessageSquare size={14}/>Request information</button><button className={styles.darkButton}>View full profile <ArrowRight size={14}/></button></div></div></aside></div>}

    {comparisonOpen&&<div className={styles.overlay} onClick={()=>setComparisonOpen(false)}><section className={styles.comparisonModal} onClick={e=>e.stopPropagation()}><header><div><span>SUPPLIER COMPARISON</span><h2>Compare your shortlist</h2></div><button onClick={()=>setComparisonOpen(false)}><X size={19}/></button></header>{compared.length<2?<div className={styles.compareEmpty}><GitCompareArrows size={28}/><h3>Select at least two suppliers</h3><p>Use the compare checkbox on supplier cards to build a side-by-side shortlist.</p></div>:<div className={styles.tableWrap}><table><thead><tr><th>Performance</th>{compared.map(s=><th key={s.id}><span style={{background:s.accent}}>{s.initials}</span><b>{s.name}</b><small>{s.trade}</small></th>)}</tr></thead><tbody>{[['Overall score','score'],['Quality','quality'],['Delivery','delivery'],['Communication','communication'],['Price / value','value'],['Verified reviews','reviews']].map(([label,key])=><tr key={key}><td>{label}</td>{compared.map(s=><td key={s.id}><strong>{s[key as keyof Supplier] as number}</strong>{key!=='reviews'&&<i><em style={{width:`${s[key as keyof Supplier]}%`}}/></i>}</td>)}</tr>)}</tbody></table></div>}</section></div>}
  </div>;
}

function Stars({count}:{count:number}){return <span className={styles.stars}>{Array.from({length:5},(_,i)=><Star key={i} size={10} fill={i<count?'currentColor':'none'}/>)}</span>}
