'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {BarChart3,Building2,MessageSquare,Search,Settings,ShieldCheck,Users2,CalendarDays,LogOut} from 'lucide-react';
import {BrandLogo} from '@/components/brand/BrandLogo';

export function Sidebar({role}:{role:'business'|'supplier'|'admin'}){
  const pathname=usePathname();
  const workspaceHome=role==='business'?'/business/dashboard':role==='supplier'?'/supplier/dashboard':'/admin';
  const items=role==='business'?[['Overview','/business/dashboard',BarChart3],['Discover','/marketplace',Search],['My network','/business/network',Users2],['Evaluations','/business/evaluations',ShieldCheck],['Inquiries','/inquiries',MessageSquare],['Meetings','/meetings',CalendarDays],['Company verification','/verification',ShieldCheck],['Settings','/settings',Settings]]:role==='supplier'?[['Overview','/supplier/dashboard',BarChart3],['Company profile','/supplier/profile',Building2],['Company verification','/verification',ShieldCheck],['Claim profile','/supplier/claim',ShieldCheck],['Claim status','/supplier/claim-status',ShieldCheck],['Performance','/supplier/performance',BarChart3],['Inquiries','/inquiries',MessageSquare],['Meetings','/meetings',CalendarDays],['Settings','/settings',Settings]]:[['Admin overview','/admin',BarChart3],['Trust review','/admin/verifications',ShieldCheck],['Claims','/admin/claims',ShieldCheck],['Marketplace','/marketplace',Search]];
  const workspaceLabel=role;
  return <aside className="sidebar"><BrandLogo variant="mark" size="md" className="brand" href={workspaceHome}/><nav aria-label={`${workspaceLabel} workspace`}>{items.map(([label,href,Icon])=>{const active=pathname===href;return <Link key={String(label)} href={String(href)} className={active?'active':undefined} aria-current={active?'page':undefined}><Icon size={17}/><span>{String(label)}</span></Link>})}<form action="/api/auth/logout" method="post"><button type="submit"><LogOut size={17}/><span>Sign out</span></button></form></nav></aside>;
}
