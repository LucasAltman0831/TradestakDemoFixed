'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {FormEvent, useState} from 'react';
import {ArrowRight, Building2, Check, Eye, EyeOff, LockKeyhole, PackageCheck, ShieldCheck} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';
import type {Role} from '@/lib/types';
import {BrandLogo} from '@/components/brand/BrandLogo';
import styles from './AuthForms.module.css';

type AccountRole = Exclude<Role, 'admin'>;

const messages: Record<string, string> = {
  confirmation_failed: 'That confirmation link is invalid or has expired. Please sign in or request a new link.',
  unauthorized: 'Please sign in to continue.',
};

function safePath(value?: string) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : undefined;
}

function friendlyError(message: string) {
  const value = message.toLowerCase();
  if (value.includes('invalid login')) return 'The email or password you entered is incorrect.';
  if (value.includes('already registered') || value.includes('already exists')) return 'An account already exists for this email. Try signing in instead.';
  if (value.includes('password')) return 'Use at least 10 characters with an uppercase letter, lowercase letter, and number.';
  if (value.includes('email')) return 'Enter a valid work email address.';
  return message;
}

function BrandPanel({mode}:{mode:'login'|'signup'}) {
  return <aside className={styles.brandPanel}>
    <BrandLogo variant="horizontal" size="lg" className={styles.brand}/>
    <div className={styles.brandCopy}>
      <p className={styles.kicker}>Supplier performance intelligence</p>
      <h2>{mode === 'login' ? 'SourceMetric Network' : 'Build trust before the first sourcing decision.'}</h2>
      <p>{mode === 'login' ? 'Your supplier intelligence workspace, ready for the next sourcing decision.' : 'Structured performance data helps purchasing teams decide with confidence and gives strong suppliers the visibility they deserve.'}</p>
      <div className={styles.proofCard}>
        <div className={styles.networkStat}><span>Live network</span><strong>Real companies. Real feedback.</strong></div>
        <div className={styles.proofMetrics}><span><ShieldCheck/><small>Role-based secure workspaces</small></span><span><ShieldCheck/><small>Transparent verification status</small></span></div>
        <p><ShieldCheck size={16}/> Reputation data contributed by SourceMetric members</p>
      </div>
    </div>
    <p className={styles.brandFooter}>Built for better supplier decisions.</p>
  </aside>;
}

function PasswordField({name='password', label='Password', autoComplete='current-password'}:{name?:string;label?:string;autoComplete?:string}) {
  const [visible,setVisible]=useState(false);
  return <label className={styles.field}><span>{label}</span><div className={styles.passwordWrap}><LockKeyhole size={17}/><input name={name} type={visible?'text':'password'} autoComplete={autoComplete} required minLength={10}/><button type="button" onClick={()=>setVisible(v=>!v)} aria-label={visible?'Hide password':'Show password'}>{visible?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>;
}

export function LoginForm({next,error}:{next?:string;error?:string}) {
  const router=useRouter();
  const [message,setMessage]=useState(error ? messages[error] ?? 'We could not complete that request.' : '');
  const [busy,setBusy]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); setMessage(''); setBusy(true);
    const form=new FormData(event.currentTarget);
    const {error: authError}=await createClient().auth.signInWithPassword({email:String(form.get('email')).trim(),password:String(form.get('password'))});
    if(authError){setMessage(friendlyError(authError.message));setBusy(false);return;}
    router.push(safePath(next) ?? '/api/auth/route'); router.refresh();
  }
  return <main className={styles.authShell}><BrandPanel mode="login"/><section className={styles.formPanel}><div className={styles.formBox}>
    <div className={styles.mobileBrand}><BrandLogo variant="horizontal" size="sm"/></div><p className={styles.eyebrow}>Secure workspace access</p><h1>Welcome back to your supplier intelligence workspace.</h1><p className={styles.intro}>Sign in to continue to the SourceMetric network.</p>
    <form onSubmit={submit} noValidate>
      <label className={styles.field}><span>Work email</span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" required/></label>
      <PasswordField/>
      <div className={styles.formMeta}><label className={styles.check}><input name="remember" type="checkbox"/><span><Check size={12}/></span>Remember me</label><Link href="/forgot-password">Forgot password?</Link></div>
      {message?<div className={styles.error} role="alert">{message}</div>:null}
      <button className={styles.primary} disabled={busy}>{busy?'Signing in…':<>Sign in <ArrowRight size={18}/></>}</button>
    </form>
    <p className={styles.switch}>Don&apos;t have an account? <Link href="/signup">Join SourceMetric</Link></p>
  </div></section></main>;
}

export function SignupForm({initialRole}:{initialRole?:string}) {
  const router=useRouter();
  const validInitial:AccountRole|undefined=initialRole==='business'||initialRole==='supplier'?initialRole:undefined;
  const [role,setRole]=useState<AccountRole|undefined>(validInitial);
  const [message,setMessage]=useState(''); const [success,setSuccess]=useState(false); const [busy,setBusy]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); if(!role)return;
    const form=new FormData(event.currentTarget); const password=String(form.get('password')); const confirm=String(form.get('confirm_password'));
    if(password!==confirm){setMessage('Passwords do not match.');return;}
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/.test(password)){setMessage('Use at least 10 characters with an uppercase letter, lowercase letter, and number.');return;}
    setBusy(true);setMessage('');
    const destination=role==='business'?'/business/dashboard':'/supplier/dashboard';
    const {data,error}=await createClient().auth.signUp({email:String(form.get('email')).trim(),password,options:{emailRedirectTo:`${location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,data:{role,company_name:String(form.get('company')).trim(),full_name:String(form.get('full_name')).trim()}}});
    setBusy(false);
    if(error){setMessage(friendlyError(error.message));return;}
    if(data.session){router.push(destination);router.refresh();return;}
    setSuccess(true);setMessage('Account created. Check your inbox to verify your email and open your workspace.');
  }
  return <main className={styles.authShell}><BrandPanel mode="signup"/><section className={styles.formPanel}><div className={`${styles.formBox} ${styles.signupBox}`}>
    <div className={styles.mobileBrand}><BrandLogo variant="horizontal" size="sm"/></div><p className={styles.eyebrow}>{role?'Create your workspace':'Choose your SourceMetric path'}</p><h1>{role?`Join as a ${role==='business'?'Business':'Supplier'}.`:'What best describes you?'}</h1>
    {!role?<><p className={styles.intro}>Your role shapes the intelligence, tools, and dashboard you see.</p><div className={styles.roleGrid}>
      <button onClick={()=>setRole('business')}><span className={styles.roleIcon}><Building2/></span><strong>Business / Buyer</strong><p>Find, compare, connect with, and evaluate suppliers.</p><em>Explore the business workspace <ArrowRight size={16}/></em></button>
      <button onClick={()=>setRole('supplier')}><span className={styles.roleIcon}><PackageCheck/></span><strong>Supplier</strong><p>Build credibility and maintain an accurate profile.</p><em>Build your supplier presence <ArrowRight size={16}/></em></button>
    </div></>:<><button className={styles.back} onClick={()=>{setRole(undefined);setMessage('')}}>← Change account type</button><form onSubmit={submit} noValidate>
      <div className={styles.twoCols}><label className={styles.field}><span>Full name</span><input name="full_name" autoComplete="name" placeholder="Alex Morgan" required minLength={2}/></label><label className={styles.field}><span>Company name</span><input name="company" autoComplete="organization" placeholder="Morgan Supply Group" required minLength={2}/></label></div>
      <label className={styles.field}><span>Work email</span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" required/></label>
      <div className={styles.twoCols}><PasswordField autoComplete="new-password"/><PasswordField name="confirm_password" label="Confirm password" autoComplete="new-password"/></div>
      <p className={styles.passwordHint}>10+ characters with uppercase, lowercase, and a number.</p>
      {message?<div className={success?styles.success:styles.error} role="status">{message}</div>:null}
      <button className={styles.primary} disabled={busy||success}>{busy?'Creating account…':success?'Check your inbox':<>Create {role==='business'?'Business':'Supplier'} Account <ArrowRight size={18}/></>}</button>
    </form></>}
    <p className={styles.switch}>Already have an account? <Link href="/login">Sign in</Link></p>
  </div></section></main>;
}

export function ForgotForm(){const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);const form=new FormData(event.currentTarget);const {error}=await createClient().auth.resetPasswordForEmail(String(form.get('email')).trim(),{redirectTo:`${location.origin}/auth/callback?next=/reset-password`});setBusy(false);setMessage(error?friendlyError(error.message):'Check your inbox for a secure password reset link.');}return <main className={styles.authShell}><BrandPanel mode="login"/><section className={styles.formPanel}><div className={styles.formBox}><p className={styles.eyebrow}>Account recovery</p><h1>Reset your password.</h1><p className={styles.intro}>Enter your work email and we&apos;ll send a secure reset link.</p><form onSubmit={submit}><label className={styles.field}><span>Work email</span><input name="email" type="email" autoComplete="email" required/></label>{message?<div className={styles.success}>{message}</div>:null}<button className={styles.primary} disabled={busy}>{busy?'Sending…':'Send reset link'}</button></form><p className={styles.switch}><Link href="/login">← Back to sign in</Link></p></div></section></main>}

export function ResetForm(){const router=useRouter();const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=new FormData(event.currentTarget);const password=String(form.get('password'));const confirm=String(form.get('confirm_password'));if(password!==confirm){setMessage('Passwords do not match.');return;}if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/.test(password)){setMessage('Use at least 10 characters with an uppercase letter, lowercase letter, and number.');return;}setBusy(true);const {error}=await createClient().auth.updateUser({password});setBusy(false);if(error){setMessage(friendlyError(error.message));return;}router.push('/api/auth/route');router.refresh();}return <main className={styles.authShell}><BrandPanel mode="login"/><section className={styles.formPanel}><div className={styles.formBox}><p className={styles.eyebrow}>Secure your account</p><h1>Choose a new password.</h1><p className={styles.intro}>Create a strong password you haven&apos;t used before.</p><form onSubmit={submit}><PasswordField name="password" label="New password" autoComplete="new-password"/><PasswordField name="confirm_password" label="Confirm password" autoComplete="new-password"/>{message?<div className={styles.error}>{message}</div>:null}<button className={styles.primary} disabled={busy}>{busy?'Updating…':'Update password'}</button></form></div></section></main>}
