import Link from 'next/link';
import {requireRole} from '@/lib/auth';
import {Sidebar} from '@/components/Sidebar';
import {WorkspaceHeading} from '@/components/WorkspaceHeading';

export default async function Page(){
  const {profile}=await requireRole(['business','supplier','admin']);
  const roleLabel=profile.role==='business'?'Business / Buyer':profile.role==='supplier'?'Supplier':'Administrator';
  return <main className="shell"><Sidebar role={profile.role}/><section className="workspace"><WorkspaceHeading eyebrow="ACCOUNT" title="Settings" description="Manage your SourceMetric identity and account security."/><div className="panel settingsPanel"><div><span>Email address</span><strong>{profile.email}</strong></div><div><span>Workspace role</span><strong>{roleLabel}</strong></div><div><span>Password</span><strong>Protected account</strong><Link className="ghost small" href="/forgot-password">Change password</Link></div></div></section></main>;
}
