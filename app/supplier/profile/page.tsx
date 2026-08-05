import Link from 'next/link';
import {requireRole} from '@/lib/auth';
import {mediaLimit,planLabel} from '@/lib/entitlements';
import {Sidebar} from '@/components/Sidebar';
import {SupplierProfileForm} from '@/components/SupplierProfileForm';
import {CompanyMediaManager} from '@/components/CompanyMediaManager';
import {WorkspaceHeading} from '@/components/WorkspaceHeading';

export default async function Page(){const {user,supabase}=await requireRole(['supplier']);const [{data:company},{data:subscription},{data:media}]=await Promise.all([supabase.from('supplier_profiles').select('*').eq('owner_id',user.id).maybeSingle(),supabase.from('subscriptions').select('plan,status').eq('user_id',user.id).maybeSingle(),supabase.from('profile_media').select('id,kind,storage_path,public_url,caption').eq('owner_id',user.id).order('created_at',{ascending:false})]);return <main className="shell"><Sidebar role="supplier"/><section className="workspace"><WorkspaceHeading eyebrow="COMPANY IDENTITY" title="Company profile" description="Keep your capabilities, service area, company information, and portfolio accurate for builders."/>{company?<><SupplierProfileForm profile={company}/><CompanyMediaManager initialMedia={(media??[]) as any} supplierId={company.id} limit={mediaLimit('supplier',subscription)} plan={planLabel('supplier',subscription)}/></>:<div className="panel emptyState"><h2>Complete company onboarding</h2><p>A connected company profile is required before media can be uploaded.</p><Link className="button" href="/supplier/claim">Find your company</Link></div>}</section></main>}
