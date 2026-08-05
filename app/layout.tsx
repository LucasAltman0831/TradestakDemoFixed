import type {Metadata} from 'next';import './globals.css';import './brand-system.css';import './production-states.css';import './media.css';import {AnalyticsListener} from '@/components/Analytics';
export const metadata:Metadata={title:'TradeStak | Construction Supplier Intelligence',description:'Discover, evaluate, and manage construction suppliers.',icons:{icon:'/icon.png',apple:'/apple-icon.png'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><AnalyticsListener/>{children}</body></html>}
