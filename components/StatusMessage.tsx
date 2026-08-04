export function StatusMessage({message,error=false}:{message:string,error?:boolean}){return message?<div className={'message '+(error?'error':'')}>{message}</div>:null}
