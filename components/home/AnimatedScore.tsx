'use client';

import {useEffect,useRef,useState} from 'react';

export function AnimatedScore({value,suffix=''}:{value:number;suffix?:string}){
  const [display,setDisplay]=useState(0);
  const scoreRef=useRef<HTMLSpanElement>(null);

  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      setDisplay(value);
      return;
    }

    const node=scoreRef.current;
    if(!node)return;

    const observer=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting)return;
      const started=performance.now();
      const tick=(now:number)=>{
        const progress=Math.min((now-started)/900,1);
        setDisplay(Math.round(value*(1-Math.pow(1-progress,3))));
        if(progress<1)requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    },{threshold:.5});

    observer.observe(node);
    return()=>observer.disconnect();
  },[value]);

  return <span ref={scoreRef}>{display}{suffix}</span>;
}
