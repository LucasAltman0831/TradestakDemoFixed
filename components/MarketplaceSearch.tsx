'use client';
import {useMemo,useState} from 'react';
import {GitCompareArrows,Search,X} from 'lucide-react';
import {SupplierCard} from './SupplierCard';
import type {Supplier} from '@/lib/types';

export function MarketplaceSearch({suppliers}:{suppliers:Supplier[]}){
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('');
  const [minimumScore,setMinimumScore]=useState('');
  const [compare,setCompare]=useState<Supplier[]>([]);
  const categories=Array.from(new Set(suppliers.map(supplier=>supplier.trade_category).filter(Boolean))).sort() as string[];
  const rows=useMemo(()=>suppliers.filter(supplier=>{const haystack=[supplier.name,supplier.trade_category,supplier.city,supplier.state,supplier.service_area,supplier.description].filter(Boolean).join(' ').toLowerCase();return haystack.includes(query.toLowerCase())&&(!category||supplier.trade_category===category)&&(!minimumScore||(supplier.score??0)>=Number(minimumScore));}),[query,category,minimumScore,suppliers]);
  function toggleCompare(supplier:Supplier){setCompare(current=>current.some(item=>item.id===supplier.id)?current.filter(item=>item.id!==supplier.id):current.length<3?[...current,supplier]:current);}
  return <>
    <div className="searchBar"><label className="searchInput"><Search size={18}/><input aria-label="Search suppliers" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Supplier, category, location, or capability"/></label><select aria-label="Filter by supplier category" value={category} onChange={event=>setCategory(event.target.value)}><option value="">All categories</option>{categories.map(item=><option key={item}>{item}</option>)}</select><select aria-label="Filter by minimum SourceMetric Score" value={minimumScore} onChange={event=>setMinimumScore(event.target.value)}><option value="">Any score</option><option value="70">70 and above</option><option value="80">80 and above</option><option value="90">90 and above</option></select></div>
    <div className="resultsSummary"><p><b>{rows.length}</b> supplier{rows.length===1?'':'s'} found</p><span>Performance data appears only when buyer evaluations exist.</span></div>
    <div className="marketGrid">{rows.map(supplier=><SupplierCard key={supplier.id} supplier={supplier} onCompare={toggleCompare} selected={compare.some(item=>item.id===supplier.id)}/>)}</div>
    {!rows.length?<div className="empty">No suppliers match those filters. Try a broader category or location.</div>:null}
    {compare.length?<section className="compareTray" aria-label="Supplier comparison"><header><div><GitCompareArrows/><span><b>Compare suppliers</b><small>Select up to three</small></span></div><button onClick={()=>setCompare([])} aria-label="Clear comparison"><X/></button></header><div className="compareGrid">{compare.map(supplier=><article key={supplier.id}><h3>{supplier.name}</h3>{[['Overall',supplier.score],['Quality',supplier.quality_score],['Delivery',supplier.delivery_score],['Service',supplier.communication_score]].map(([label,value])=><p key={String(label)}><span>{label}</span><b>{value??'—'}</b></p>)}<small>{supplier.trade_category||'Category not provided'} · {supplier.service_area||[supplier.city,supplier.state].filter(Boolean).join(', ')||'Service area not provided'}</small></article>)}</div></section>:null}
  </>;
}
