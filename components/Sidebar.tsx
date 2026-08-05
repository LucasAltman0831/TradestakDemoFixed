'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {BarChart3,Building2,Layers3,Search,Settings,ShieldCheck,Users2,CreditCard,LogOut} from 'lucide-react';
import {BrandLogo} from '@/components/brand/BrandLogo';

export function Sidebar({role}:{role:'builder'|'supplier'|'admin'}){
  const pathname=usePathname();
  const workspaceHome=role==='builder'?'/builder/dashboard':role==='supplier'?'/supplier/dashboard':'/admin';
  const items=role==='builder'?[['Overview','/builder/dashboard',BarChart3],['Discover','/marketplace',Search],['My network','/builder/network',Users2],['Analytics','/builder/analytics',Layers3],['Evaluations','/builder/evaluations',ShieldCheck],['Company verification','/verification',ShieldCheck],['Billing','/builder/billing',CreditCard],['Settings','/settings',Settings]]:role==='supplier'?[['Overview','/supplier/dashboard',BarChart3],['Company profile','/supplier/profile',Building2],['Company verification','/verification',ShieldCheck],['Claim profile','/supplier/claim',ShieldCheck],['Claim status','/supplier/claim-status',ShieldCheck],['Performance','/supplier/performance',Layers3],['Billing','/supplier/billing',CreditCard],['Settings','/settings',Settings]]:[['Admin overview','/admin',BarChart3],['Trust review','/admin/verifications',ShieldCheck],['Claims','/admin/claims',ShieldCheck],['Import suppliers','/admin/import',Building2],['Marketplace','/marketplace',Search]];
  const workspaceLabel=role==='builder'?'business':role;
  return <aside className="sidebar"><BrandLogo variant="mark" size="md" className="brand" href={workspaceHome}/><nav aria-label={`${workspaceLabel} workspace`}>{items.map(([label,href,Icon])=>{const active=pathname===href;return <Link key={String(label)} href={String(href)} className={active?'active':undefined} aria-current={active?'page':undefined}><Icon size={17}/><span>{String(label)}</span></Link>})}<form action="/api/auth/logout" method="post"><button type="submit"><LogOut size={17}/><span>Sign out</span></button></form></nav></aside>;
}
