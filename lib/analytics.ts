export type AnalyticsEventName='homepage_visit'|'signup_click'|'marketplace_search'|'supplier_profile_view'|'claim_request';
type Properties=Record<string,string|number|boolean|undefined>;
export function trackEvent(event:AnalyticsEventName,properties:Properties={}){if(typeof window==='undefined')return;const detail={event,properties,timestamp:new Date().toISOString()};window.dispatchEvent(new CustomEvent('tradestak:analytics',{detail}));if(process.env.NODE_ENV==='development')console.info('[TradeStak analytics]',detail);}
