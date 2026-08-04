import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

import { requireEnv } from '@/lib/env';
import { createAdminClient } from '@/lib/supabase/admin';

function getCurrentPeriodEnd(subscription: Stripe.Subscription): string | null {
  const timestamp = subscription.items.data[0]?.current_period_end;

  return timestamp ? new Date(timestamp * 1000).toISOString() : null;
}

export async function POST(request: Request) {
  const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'));
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      requireEnv('STRIPE_WEBHOOK_SECRET'),
    );
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error);

    return NextResponse.json(
      { error: 'Invalid Stripe signature' },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { data: existingEvent, error: existingEventError } = await admin
    .from('processed_webhook_events')
    .select('id')
    .eq('id', event.id)
    .maybeSingle();

  if (existingEventError) {
    console.error('Unable to check processed webhook events:', existingEventError);

    return NextResponse.json(
      { error: 'Unable to process webhook' },
      { status: 500 },
    );
  }

  if (existingEvent) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    if (event.type.startsWith('customer.subscription.')) {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.user_id;
      const customerId =
        typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer.id;

      if (userId) {
        const { error: subscriptionError } = await admin
          .from('subscriptions')
          .upsert(
            {
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              plan: 'builder_pro',
              status: subscription.status,
              current_period_end: getCurrentPeriodEnd(subscription),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' },
          );

        if (subscriptionError) throw subscriptionError;
      }
    } else if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id ?? session.metadata?.user_id;

      if (userId && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          String(session.subscription),
        );
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id;

        const { error: subscriptionError } = await admin
          .from('subscriptions')
          .upsert(
            {
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              plan: 'builder_pro',
              status: subscription.status,
              current_period_end: getCurrentPeriodEnd(subscription),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' },
          );

        if (subscriptionError) throw subscriptionError;
      }
    } else if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.id;

      if (customerId) {
        const { error: paymentError } = await admin
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        if (paymentError) throw paymentError;
      }
    }

    const { error: processedEventError } = await admin
      .from('processed_webhook_events')
      .insert({
        id: event.id,
        event_type: event.type,
      });

    if (processedEventError) throw processedEventError;

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Stripe webhook ${event.id} failed:`, error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Webhook processing failed',
      },
      { status: 500 },
    );
  }
}
