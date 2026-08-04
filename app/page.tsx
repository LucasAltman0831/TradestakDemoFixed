import {HomeExperience} from '@/components/home/HomeExperience';
import {AnalyticsEvent} from '@/components/Analytics';

export default function Home(){
  return <><AnalyticsEvent event="homepage_visit"/><HomeExperience/></>;
}
