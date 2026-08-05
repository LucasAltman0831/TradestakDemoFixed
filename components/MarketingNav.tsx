'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ArrowRight,Menu,X} from 'lucide-react';
import {useState} from 'react';
import {BrandLogo} from '@/components/brand/BrandLogo';
import styles from './MarketingNav.module.css';

export type MarketingViewer={name:string|null;dashboard:string}|null;

const links=[
  {label:'Suppliers',href:'/marketplace',path:'/marketplace'},
  {label:'Product tour',href:'/demo',path:'/demo'},
  {label:'How it works',href:'/#how-it-works',path:null},
  {label:'For businesses',href:'/#businesses',path:null},
  {label:'For suppliers',href:'/#suppliers',path:null},
  {label:'Pricing',href:'/pricing',path:'/pricing'},
];

export function MarketingNav({viewer=null}:{viewer?:MarketingViewer}){
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  return <header className={styles.header}>
    <BrandLogo variant="horizontal" size="md" className={styles.brand}/>
    <nav className={open?styles.open:undefined} aria-label="Primary navigation">
      {links.map(item=>{
        const active=item.path&&(pathname===item.path||pathname.startsWith(`${item.path}/`)||(item.path==='/marketplace'&&pathname.startsWith('/suppliers/')));
        return <Link href={item.href} key={item.label} className={active?styles.active:undefined} aria-current={active?'page':undefined} onClick={()=>setOpen(false)}>{item.label}</Link>;
      })}
    </nav>
    <div className={styles.actions}>{viewer?<><Link className={styles.signIn} href="/profile">{viewer.name?.split(' ')[0]||'Profile'}</Link><Link className={styles.cta} href={viewer.dashboard}>Dashboard <ArrowRight size={15}/></Link></>:<><Link className={styles.signIn} href="/login">Sign in</Link><Link className={styles.cta} href="/signup">Get started <ArrowRight size={15}/></Link></>}<button type="button" className={styles.menuButton} onClick={()=>setOpen(value=>!value)} aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open}>{open?<X/>:<Menu/>}</button></div>
  </header>;
}
