import {Nav} from '@/components/Nav';
import {getViewer} from '@/lib/auth';
import {redirect} from 'next/navigation';

export default async function ProfilePage(){
  const {user,profile}=await getViewer();
  if(!user||!profile)redirect('/login?next=/profile');
  return <><Nav/><main className="authPage"><section className="authCard"><span className="badge">{profile.role==='builder'?'Builder / Buyer':'Supplier / Trade Partner'}</span><h1>{profile.full_name||'Your profile'}</h1><p className="lede">Your secure TradeStak account details.</p><div className="metricGrid"><div className="metric"><span>Company</span><strong style={{fontSize:20}}>{profile.company_name||'Not provided'}</strong></div><div className="metric"><span>Email</span><strong style={{fontSize:16}}>{profile.email||user.email}</strong></div></div><p style={{color:'var(--muted)',fontSize:13,marginTop:24}}>Member since {new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric'}).format(new Date(profile.created_at))}</p></section></main></>;
}
