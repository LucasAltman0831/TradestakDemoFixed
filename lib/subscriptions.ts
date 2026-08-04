import 'server-only';
import Stripe from 'stripe';
import {createAdminClient} from '@/lib/supabase/admin';
import {isPaidPlan,type PaidPlan} from '@/lib/stripe';

export function currentPeriodEnd(subscription:Stripe.Subscription){const timestamp=subscription.items.data[0]?.current_period_end;return timestamp?new Date(timestamp*1000).toISOString():null;}
export async function syncSubscription(subscription:Stripe.Subscription,fallbackUserId?:string,fallbackPlan?:PaidPlan){
  const userId=subscription.metadata.user_id||fallbackUserId;
  const planValue=subscription.metadata.plan||fallbackPlan;
  if(!userId||!isPaidPlan(planValue))throw new Error('Subscription is missing trusted TradeStak metadata.');
  const customerId=typeof subscription.customer==='string'?subscription.customer:subscription.customer.id;
  const {error}=await createAdminClient().from('subscriptions').upsert({user_id:userId,stripe_customer_id:customerId,stripe_subscription_id:subscription.id,plan:planValue,status:subscription.status,current_period_end:currentPeriodEnd(subscription),updated_at:new Date().toISOString()},{onConflict:'user_id'});
  if(error)throw error;
}
