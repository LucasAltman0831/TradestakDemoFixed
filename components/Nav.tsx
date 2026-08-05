import {getViewer,dashboardFor} from '@/lib/auth';
import {MarketingNav} from '@/components/MarketingNav';

export async function Nav(){const {user,profile}=await getViewer();return <MarketingNav viewer={user&&profile?{name:profile.full_name,dashboard:dashboardFor(profile.role)}:null}/>}
