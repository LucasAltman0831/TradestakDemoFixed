import {HomeExperience} from '@/components/home/HomeExperience';
import {AnalyticsEvent} from '@/components/Analytics';
import {dashboardFor,getViewer} from '@/lib/auth';

export default async function Home(){
  const {user,profile}=await getViewer();
  return <><AnalyticsEvent event="homepage_visit"/><HomeExperience viewer={user&&profile?{name:profile.full_name,role:profile.role,dashboard:dashboardFor(profile.role)}:null}/></>;
}
