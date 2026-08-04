import {createClient} from '@supabase/supabase-js';

const required=['NEXT_PUBLIC_SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','DEMO_BUILDER_EMAIL','DEMO_BUILDER_PASSWORD','DEMO_SUPPLIER_EMAIL','DEMO_SUPPLIER_PASSWORD'];
for(const name of required)if(!process.env[name])throw new Error(`Missing ${name}`);
if(process.env.NEXT_PUBLIC_APP_MODE==='production')throw new Error('Demo accounts cannot be provisioned while NEXT_PUBLIC_APP_MODE=production.');
const admin=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}});
const accounts=[
  {email:process.env.DEMO_BUILDER_EMAIL,password:process.env.DEMO_BUILDER_PASSWORD,role:'builder',company_name:'Harrison & Alder Construction',full_name:'Demo Builder'},
  {email:process.env.DEMO_SUPPLIER_EMAIL,password:process.env.DEMO_SUPPLIER_PASSWORD,role:'supplier',company_name:'Northline Concrete Co.',full_name:'Demo Supplier'},
];
for(const account of accounts){const {error}=await admin.auth.admin.createUser({email:account.email,password:account.password,email_confirm:true,user_metadata:{role:account.role,company_name:account.company_name,full_name:account.full_name}});if(error&&!error.message.toLowerCase().includes('already'))throw error;console.log(`Demo ${account.role} account ready: ${account.email}`);}
