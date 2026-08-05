import {PricingExperience} from '@/components/pricing/PricingExperience';
import {dashboardFor,getViewer} from '@/lib/auth';

export default async function Page(){
  const {user,profile}=await getViewer();
  return <PricingExperience viewer={user&&profile?{name:profile.full_name,dashboard:dashboardFor(profile.role)}:null}/>;
}
