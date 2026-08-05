import 'server-only';
import {NextResponse} from 'next/server';
import {getViewer} from '@/lib/auth';
import {createAdminClient} from '@/lib/supabase/admin';
import {requireEnv,siteUrl} from '@/lib/env';
import {getStripe,paidPlans,type PaidPlan} from '@/lib/stripe';

export async function createSubscriptionCheckout(plan:PaidPlan){
  if(process.env.ENABLE_PAID_CHECKOUT!=='true')return NextResponse.json({error:'Paid subscriptions are not available during the free launch period.'},{status:503});
  const config=paidPlans[plan];const {user,profile}=await getViewer();
  if(!user)return NextResponse.json({error:'Sign in to continue to secure checkout.'},{status:401});
  if(profile?.role!==config.role)return NextResponse.json({error:`A ${config.role} account is required for this plan.`},{status:403});
  const admin=createAdminClient();const {data:existing,error:readError}=await admin.from('subscriptions').select('*').eq('user_id',user.id).maybeSingle();
  if(readError)return NextResponse.json({error:'Unable to read your billing account.'},{status:500});
  if(existing?.status&&['active','trialing','past_due'].includes(existing.status))return NextResponse.json({error:'You already have a subscription. Use Manage billing to change or cancel it.'},{status:409});
  try{
    const stripe=getStripe();let customerId=existing?.stripe_customer_id as string|undefined;
    if(!customerId){const customer=await stripe.customers.create({email:user.email,metadata:{user_id:user.id,role:config.role}});customerId=customer.id;}
    const session=await stripe.checkout.sessions.create({mode:'subscription',customer:customerId,line_items:[{price:requireEnv(config.priceEnv),quantity:1}],success_url:`${siteUrl()}${config.billingPath}?checkout=success`,cancel_url:`${siteUrl()}${config.billingPath}?checkout=canceled`,client_reference_id:user.id,metadata:{user_id:user.id,plan,role:config.role},subscription_data:{metadata:{user_id:user.id,plan,role:config.role}},allow_promotion_codes:true});
    const {error:saveError}=await admin.from('subscriptions').upsert({user_id:user.id,stripe_customer_id:customerId,plan,status:'checkout_started',updated_at:new Date().toISOString()},{onConflict:'user_id'});
    if(saveError)throw saveError;
    return NextResponse.json({url:session.url});
  }catch(error){console.error('Stripe checkout creation failed:',error);return NextResponse.json({error:'Secure checkout is temporarily unavailable. Please try again.'},{status:500});}
}
