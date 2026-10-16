# Database, privacy and rollback runbook

This is an operator review plan. No production resource was created. Do not copy local test fixture flags, database IDs or keys into production.

## Bind the existing Worker only after access/approval

Use pinned Wrangler 4.147.0. Inspect `whoami`, `deployments list --name mykidsnest-site`, `versions list --name mykidsnest-site`, custom domains and existing bindings. Expected account is `f2e22e5cefa40fa25e8a461a149ae12c`; expected handoff version is `87e64dd7-d876-4104-ac16-c9ab139ea239`. Stop if anything differs until reconciled. Verify permissions and the actual rollback target before release. No second Worker, temporary account, DNS or legacy route change is allowed.

Select/create an authorized D1 database for MyKidsNest in that account, record its REAL ID, and add the binding below to the existing site's reviewed configuration. Do not use a made-up UUID:

- binding: `LEADS_DB`
- database_name / database_id: actual verified values
- migrations_dir: `migrations`

Apply `0001_parent_inquiries.sql` to that verified binding. Native local migration was tested; remote migration is pending. Use `wrangler d1 migrations list` before and after `wrangler d1 migrations apply LEADS_DB --remote --config sites/mykidsnest/wrangler.jsonc`. Confirm the actual CLI binding/database before each write.

Set `LEAD_HASH_SECRET` with the existing account's approved secret mechanism, at least 32 high-entropy characters. Never put it in source, logs or this document. It keys form signatures, duplicate fingerprints and short-lived abuse buckets; changing it invalidates old form tokens/fingerprints. There is no public admin endpoint; owner data access uses authenticated Cloudflare D1 tools only.

## Collection gate

All of these are required:

- `LEAD_COLLECTION_ENABLED=true` (last step only)
- `LEAD_POLICY_APPROVED=2026-10-16-v1` after explicit owner review of the actual notice
- `LEAD_RETENTION_READY=true` after cleanup scheduling/backups/monitoring are verified
- actual `LEADS_DB` binding and secret

Missing any requirement keeps the endpoint closed. Configure a daily retention trigger on this same Worker, separately from the existing content automation. The exported `scheduled()` handler deletes expired active inquiries and rate buckets; submit processing also purges expired rows. A suitable UTC retention time can be selected by the owner; no Cron was installed here. Test the handler with synthetic expired/current rows and monitor task failures before setting the retention-ready flag. Confirm D1 backup/Time Travel behavior and deletion request handling; do not promise that active-table deletion erases provider backups instantly.

The active inquiry expiry is 30 days from submit; rate buckets expire within two hours. No raw IP, child identity, photos or full referrer URL is stored. Do not export contacts into the content engine or analytics. Count only successfully saved, consented inquiries; do not infer sales or qualified demand without separate evidence.

Notification integration is NOT_CONFIGURED. Owner must check restricted inquiries and reply manually using an authorized channel; no email or service response deadline is invented. Approve the responsible operator and contact/privacy process before collection.

## Synthetic end-to-end production check (only after authorized release)

From a real theme page, follow its parent CTA. Use an adult name such as `Synthetic Adult` and `synthetic@example.invalid`, known test campaign codes, no child/personal data. Confirm consent required; valid success yields a reference only after insert. Verify the same reference/consent/timestamp/expiry/source in restricted D1. Repeat the request and confirm a single row; reject bad origin, missing consent, invalid/unknown fields, oversize and abuse. Test unavailable/offline/storage-failure messaging. Confirm any notification only if actually configured. Remove the exact synthetic row by its reference, verify removal and record the test result without retaining contact fields in reports.

## Rollback

1. First set collection off; verify POST fails closed. Preserve restricted records and retention duties.
2. Prefer rolling back code while retaining the disabled collection/cleanup capability when any real inquiries exist.
3. If a full rollback to the historical static version is necessary, first establish an approved restricted cleanup/deletion path for any D1 records. The old Worker has no D1 or scheduled handler and cannot fulfil retention by itself. Never delete the database as an automatic rollback step.
4. With explicit release authority and verified version availability/permissions, `wrangler rollback 87e64dd7-d876-4104-ac16-c9ab139ea239 --name mykidsnest-site --config sites/mykidsnest/wrangler.jsonc` is the candidate command form. It was inspected with `--help`, NOT executed and NOT proven authorized here.
5. Recheck MyKidsNest routes, aliases, headers, branded 404 and the four legacy routes. Never roll back another Worker or alter SpringOfZen.
