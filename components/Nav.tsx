import Link from 'next/link';
import {getViewer,dashboardFor} from '@/lib/auth';
import {BrandLogo} from '@/components/brand/BrandLogo';

export async function Nav(){const {user,profile}=await getViewer();return <header className="nav"><BrandLogo variant="horizontal" size="sm" className="brand"/><nav aria-label="Main navigation"><Link href="/marketplace">Suppliers</Link><Link href="/#how-it-works">How it works</Link><Link href="/#businesses">For businesses</Link><Link href="/#suppliers">For suppliers</Link><Link href="/pricing">Pricing</Link></nav><div className="actions">{user&&profile?<><Link className="ghost" href={dashboardFor(profile.role)}>Dashboard</Link><Link className="ghost navProfile" href="/profile">Profile</Link><form action="/api/auth/logout" method="post"><button className="button small" type="submit">Log out</button></form></>:<><Link className="ghost" href="/login">Sign in</Link><Link className="button small" href="/signup">Get started</Link></>}</div></header>}
