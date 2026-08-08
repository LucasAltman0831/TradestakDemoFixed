-- Non-destructive advisor cleanup after SourceMetric V1 migration.
create index if not exists meeting_requests_inquiry_idx on public.meeting_requests(inquiry_id);
create index if not exists messages_sender_idx on public.messages(sender_user_id);
create index if not exists messages_recipient_idx on public.messages(recipient_user_id);
create index if not exists moderation_audit_actor_idx on public.moderation_audit_log(actor_user_id);
create index if not exists profile_corrections_supplier_idx on public.profile_corrections(supplier_profile_id);
create index if not exists profile_corrections_requester_idx on public.profile_corrections(requester_user_id);
create index if not exists review_reports_reporter_idx on public.review_reports(reporter_user_id);
