'use client';

import {useState} from 'react';
import {StatusMessage} from './StatusMessage';

export function SaveSupplierButton({id}:{id:string}){
  const [message,setMessage]=useState('');
  async function save(){const response=await fetch('/api/builder/saved',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({supplier_id:id})});const result=await response.json();setMessage(response.ok?'Supplier saved.':result.error||'Unable to save supplier.')}
  return <><button className="button" onClick={save}>Save supplier</button><StatusMessage message={message} error={message.startsWith('Unable')}/></>;
}

export function EvaluationForm({id}:{id:string}){
  const [message,setMessage]=useState('');
  const [publish,setPublish]=useState(false);
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=new FormData(event.currentTarget);
    const body={supplier_profile_id:id,quality:Number(form.get('quality')),delivery:Number(form.get('delivery')),communication:Number(form.get('communication')),notes:String(form.get('notes')),relationship_attested:form.get('relationship_attested')==='on',relationship_context:String(form.get('relationship_context')),publish_review:publish,project_name:String(form.get('project_name')),project_type:String(form.get('project_type')),review_body:String(form.get('review_body'))};
    const response=await fetch('/api/builder/evaluations',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
    const result=await response.json();
    setMessage(response.ok?(result.review_status==='pending_moderation'?'Evaluation saved. The written review is pending SourceMetric moderation.':'Evaluation submitted.'):result.error||'Unable to save evaluation.');
    if(response.ok)event.currentTarget.reset();
  }
  return <form onSubmit={submit}><h3>Evaluate this supplier</h3><p><small>Your verified company identity is attached to this evaluation. Your name is not displayed publicly.</small></p><label>Quality (1–100)</label><input name="quality" type="number" min="1" max="100" required/><label>Delivery (1–100)</label><input name="delivery" type="number" min="1" max="100" required/><label>Service (1–100)</label><input name="communication" type="number" min="1" max="100" required/><label>Relationship context<textarea name="relationship_context" rows={3} minLength={10} maxLength={500} placeholder="Briefly describe when and how your company worked with this supplier." required/></label><label>Private notes</label><textarea name="notes" rows={3}/><label style={{display:'flex',gap:8,alignItems:'flex-start'}}><input name="relationship_attested" type="checkbox" style={{width:'auto',marginTop:3}} required/>I confirm that my company has direct, genuine business experience with this supplier and that this evaluation is accurate.</label><label style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" style={{width:'auto'}} checked={publish} onChange={event=>setPublish(event.target.checked)}/>Submit a written review for public moderation</label>{publish?<><label>Engagement name<input name="project_name" maxLength={160}/></label><label>Engagement type<input name="project_type" maxLength={100}/></label><label>Public review<textarea name="review_body" rows={4} required maxLength={2000}/></label></>:null}<button className="button full">Submit verified evaluation</button><StatusMessage message={message} error={Boolean(message)&&(message.startsWith('Unable')||message.includes('must be verified'))}/><small>Written reviews appear publicly only after SourceMetric confirms the builder account and moderates the submission.</small></form>;
}
