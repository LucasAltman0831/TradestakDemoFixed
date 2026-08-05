export type SubscriptionRow={plan:string;status:string}|null;

export function hasPaidAccess(subscription:SubscriptionRow){return Boolean(subscription&&['active','trialing'].includes(subscription.status)&&!['builder_free','supplier_free'].includes(subscription.plan));}
export function hasBusinessIntelligenceAccess(_subscription:SubscriptionRow){return true;}
export function mediaLimit(role:'builder'|'supplier',subscription:SubscriptionRow){if(role==='supplier')return 10;if(!hasPaidAccess(subscription))return 3;return 25;}
export function planLabel(role:'builder'|'supplier',subscription:SubscriptionRow){if(role==='builder')return 'Buyer Access — Free';if(!hasPaidAccess(subscription))return 'Supplier Profile';if(subscription?.plan==='supplier_premium')return 'Supplier Premium';return 'Supplier Growth';}
