export type SubscriptionRow={plan:string;status:string}|null;

export function hasPaidAccess(subscription:SubscriptionRow){return Boolean(subscription&&['active','trialing'].includes(subscription.status)&&!['builder_free','supplier_free'].includes(subscription.plan));}
export function hasBusinessIntelligenceAccess(_subscription:SubscriptionRow){return true;}
export function mediaLimit(role:'business'|'supplier',_subscription:SubscriptionRow){return role==='supplier'?10:3;}
export function planLabel(role:'business'|'supplier',_subscription:SubscriptionRow){return role==='business'?'Business Access — Free':'Supplier Access — Free';}
