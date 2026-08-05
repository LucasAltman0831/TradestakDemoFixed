import type {Metadata} from 'next';
import {DemoExperience} from '@/components/demo/DemoExperience';
import {MarketingNav} from '@/components/MarketingNav';
import {dashboardFor,getViewer} from '@/lib/auth';

export const metadata:Metadata={title:'Product Tour',description:'See the SourceMetric workflow from supplier discovery through ongoing performance management.'};

export default async function DemoPage(){const {user,profile}=await getViewer();return <><MarketingNav viewer={user&&profile?{name:profile.full_name,dashboard:dashboardFor(profile.role)}:null}/><DemoExperience/></>;}
