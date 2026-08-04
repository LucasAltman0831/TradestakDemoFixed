export function requireEnv(name:string){const v=process.env[name];if(!v)throw new Error(`Missing environment variable: ${name}`);return v;}
export const siteUrl=()=>process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';
