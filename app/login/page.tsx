import type {Metadata} from 'next';import {LoginForm} from '@/components/AuthForms';
export const metadata:Metadata={title:'Sign in | TradeStak'};
export default async function Page({searchParams}:{searchParams:Promise<{next?:string;error?:string}>}){const params=await searchParams;return <LoginForm next={params.next} error={params.error}/>}
