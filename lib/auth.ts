import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';
import type {Role,Profile} from '@/lib/types';
export async function getViewer(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return {user:null,profile:null,supabase};const {data:profile}=await supabase.from('profiles').select('*').eq('id',user.id).maybeSingle();return {user,profile:profile as Profile|null,supabase};}
export async function requireRole(roles:Role[]){const viewer=await getViewer();if(!viewer.user)redirect('/login?next='+encodeURIComponent('/'+roles[0]+'/dashboard'));if(!viewer.profile||!roles.includes(viewer.profile.role))redirect('/unauthorized');return {...viewer,user:viewer.user!,profile:viewer.profile!};}
export function dashboardFor(role:Role){return role==='supplier'?'/supplier/dashboard':role==='admin'?'/admin':'/builder/dashboard';}
