import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import {createAdminClient} from '@/lib/supabase/admin';
import {requireEnv} from '@/lib/env';
import {getStripe,isPaidPlan} from '@/lib/stripe';
import {syncSubscription} from '@/lib/subscriptions';

export const runtime='nodejs';

export async function POST(request:Request){
  const signature=request.headers.get('stripe-signature');
  if(!signature)return NextResponse.json({error:'Missing Stripe signature.'},{status:400});
  let event:Stripe.Event;
  try{event=getStripe().webhooks.constructEvent(await request.text(),signature,requireEnv('STRIPE_WEBHOOK_SECRET'));}
  catch(error){console.error('Stripe webhook signature verification failed:',error);return NextResponse.json({error:'Invalid Stripe signature.'},{status:400});}

  const admin=createAdminClient();
  const {data:seen,error:seenError}=await admin.from('processed_webhook_events').select('id').eq('id',event.id).maybeSingle();
  if(seenError)return NextResponse.json({error:'Unable to process webhook.'},{status:500});
  if(seen)return NextResponse.json({received:true,duplicate:true});

  try{
    switch(event.type){
      case 'checkout.session.completed':{
        const session=event.data.object as Stripe.Checkout.Session;const userId=session.client_reference_id??session.metadata?.user_id;const plan=session.metadata?.plan;
        if(userId&&session.subscription&&isPaidPlan(plan)){const subscription=await getStripe().subscriptions.retrieve(String(session.subscription));await syncSubscription(subscription,userId,plan);}
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await syncSubscription(event.data.object as Stripe.Subscription);break;
      case 'invoice.payment_failed':{
        const invoice=event.data.object as Stripe.Invoice;const customerId=typeof invoice.customer==='string'?invoice.customer:invoice.customer?.id;
        if(customerId){const {error}=await admin.from('subscriptions').update({status:'past_due',updated_at:new Date().toISOString()}).eq('stripe_customer_id',customerId);if(error)throw error;}
        break;
      }
    }
    const {error}=await admin.from('processed_webhook_events').insert({id:event.id,event_type:event.type});if(error)throw error;
    return NextResponse.json({received:true});
  }catch(error){console.error(`Stripe webhook ${event.id} failed:`,error);return NextResponse.json({error:'Webhook processing failed.'},{status:500});}
}
