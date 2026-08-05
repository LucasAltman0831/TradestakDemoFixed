import type {Metadata} from 'next';import {SignupForm} from '@/components/AuthForms';
export const metadata:Metadata={title:'Join SourceMetric'};
export default async function Page({searchParams}:{searchParams:Promise<{role?:string}>}){const params=await searchParams;return <SignupForm initialRole={params.role}/>}
