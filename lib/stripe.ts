import 'server-only';
import Stripe from 'stripe';
import type {Role} from '@/lib/types';
import {requireEnv} from '@/lib/env';

export type PaidPlan='builder_pro'|'supplier_verified'|'supplier_premium';
type PlanConfig={name:string;role:Extract<Role,'builder'|'supplier'>;priceEnv:string;billingPath:string};

export const paidPlans:Record<PaidPlan,PlanConfig>={
  builder_pro:{name:'TradeStak Builder Pro',role:'builder',priceEnv:'STRIPE_BUILDER_PRO_PRICE_ID',billingPath:'/builder/billing'},
  supplier_verified:{name:'TradeStak Supplier Growth',role:'supplier',priceEnv:'STRIPE_SUPPLIER_VERIFIED_PRICE_ID',billingPath:'/supplier/billing'},
  supplier_premium:{name:'TradeStak Supplier Premium',role:'supplier',priceEnv:'STRIPE_SUPPLIER_PREMIUM_PRICE_ID',billingPath:'/supplier/billing'},
};

let stripeClient:Stripe|undefined;
export function getStripe(){stripeClient??=new Stripe(requireEnv('STRIPE_SECRET_KEY'),{typescript:true});return stripeClient;}
export function isPaidPlan(value:string|undefined|null):value is PaidPlan{return Boolean(value&&value in paidPlans);}
