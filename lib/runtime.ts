export type AppMode='demo'|'production';
export function appMode():AppMode{return process.env.NEXT_PUBLIC_APP_MODE==='production'?'production':'demo';}
export function isDemoMode(){return appMode()==='demo';}
