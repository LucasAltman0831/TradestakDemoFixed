'use client';
import {useEffect} from 'react';
import {trackEvent,type AnalyticsEventName} from '@/lib/analytics';
export function AnalyticsEvent({event,properties}:{event:AnalyticsEventName;properties?:Record<string,string|number|boolean>}){useEffect(()=>{trackEvent(event,properties)},[event,properties]);return null;}
export function AnalyticsListener(){useEffect(()=>{const handle=(click:MouseEvent)=>{const element=(click.target as HTMLElement).closest<HTMLElement>('[data-analytics-event]');const event=element?.dataset.analyticsEvent as AnalyticsEventName|undefined;if(event&&element)trackEvent(event,{destination:element.dataset.analyticsDestination});};const submit=()=>{if(window.location.pathname.startsWith('/claim/'))trackEvent('claim_request',{path:window.location.pathname})};document.addEventListener('click',handle);document.addEventListener('submit',submit);return()=>{document.removeEventListener('click',handle);document.removeEventListener('submit',submit)};},[]);return null;}
