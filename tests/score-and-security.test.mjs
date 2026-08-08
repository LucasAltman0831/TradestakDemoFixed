import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const sql=readFileSync(new URL('../supabase/migrations/20260808_sourcemetric_v1.sql',import.meta.url),'utf8');
test('score requires three eligible evaluations',()=>assert.match(sql,/case when x\.n>=3 then round/));
test('score uses all five equally weighted factors',()=>assert.match(sql,/x\.quality\+x\.reliability\+x\.delivery\+x\.communication\+x\.value/));
test('privileged functions live outside public',()=>{assert.match(sql,/create or replace function private\.handle_new_user/);assert.match(sql,/create or replace function private\.refresh_supplier_scores/);assert.doesNotMatch(sql,/create or replace function public\.refresh_supplier_scores/)});
test('private communication has participant RLS',()=>{assert.match(sql,/create policy inquiries_participant_select/);assert.match(sql,/create policy messages_participant_select/);assert.match(sql,/create policy meetings_participant_select/)});
