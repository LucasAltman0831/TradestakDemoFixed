export type SubscriptionRow={plan:string;status:string}|null;

export function hasPaidAccess(subscription:SubscriptionRow){return Boolean(subscription&&['active','trialing'].includes(subscription.status)&&!['builder_free','supplier_free'].includes(subscription.plan));}
export function mediaLimit(role:'builder'|'supplier',subscription:SubscriptionRow){if(!hasPaidAccess(subscription))return role==='builder'?3:4;if(subscription?.plan==='supplier_premium')return 60;return role==='builder'?25:20;}
export function planLabel(role:'builder'|'supplier',subscription:SubscriptionRow){if(!hasPaidAccess(subscription))return role==='builder'?'Business Free':'Supplier Free';if(subscription?.plan==='builder_pro')return 'Business Pro';if(subscription?.plan==='supplier_premium')return 'Supplier Premium';return 'Supplier Growth';}
