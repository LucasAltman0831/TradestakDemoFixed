import type {Metadata} from 'next';import './globals.css';
export const metadata:Metadata={title:'TradeStak | Construction Supplier Intelligence',description:'Discover, evaluate, and manage construction suppliers.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
