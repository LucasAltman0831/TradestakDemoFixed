import type {Metadata} from 'next';
import {DemoExperience} from '@/components/demo/DemoExperience';

export const metadata:Metadata={title:'Product Tour',description:'See the SourceMetric workflow from supplier discovery through ongoing performance management.'};

export default function DemoPage(){return <DemoExperience/>;}
