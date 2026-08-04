import {createServerClient} from '@supabase/ssr';
import {NextResponse,type NextRequest} from 'next/server';
import type {Role} from '@/lib/types';

const protectedArea=(pathname:string):Role|null=>pathname.startsWith('/builder/')?'builder':pathname.startsWith('/supplier/')?'supplier':pathname==='/admin'||pathname.startsWith('/admin/')?'admin':null;
const safeNext=(request:NextRequest)=>`${request.nextUrl.pathname}${request.nextUrl.search}`;

export async function middleware(request:NextRequest){
  let response=NextResponse.next({request});
  const supabase=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll:()=>request.cookies.getAll(),setAll(items){items.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});items.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});
  const {data:{user}}=await supabase.auth.getUser();
  const requiredRole=protectedArea(request.nextUrl.pathname);
  if(!requiredRole)return response;
  if(!user){const login=new URL('/login',request.url);login.searchParams.set('next',safeNext(request));return NextResponse.redirect(login);}
  const {data:profile}=await supabase.from('profiles').select('role').eq('id',user.id).maybeSingle();
  if(!profile||profile.role!==requiredRole)return NextResponse.redirect(new URL('/unauthorized',request.url));
  return response;
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']};
