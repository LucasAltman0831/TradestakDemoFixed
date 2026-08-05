'use client';

import {useState} from 'react';
import {StatusMessage} from '@/components/StatusMessage';

export function TrustReviewActions({kind,id}:{kind:'verification'|'review';id:string}){
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  async function act(action:'approve'|'reject'){setBusy(true);setMessage('');const response=await fetch(`/api/admin/${kind==='verification'?'verifications':'reviews'}/${id}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action})});const body=await response.json();setBusy(false);setMessage(response.ok?`${kind==='verification'?'Company verification':'Review'} ${action==='approve'?'approved':'rejected'}.`:body.error||'Unable to complete review.');if(response.ok)location.reload()}
  return <div className="trust-review-actions"><button className="button small" disabled={busy} onClick={()=>act('approve')}>Approve</button><button className="ghost small" disabled={busy} onClick={()=>act('reject')}>Reject</button><StatusMessage message={message} error={Boolean(message)&&message.includes('Unable')}/></div>;
}
