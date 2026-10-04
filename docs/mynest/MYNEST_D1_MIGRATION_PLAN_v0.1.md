# MyNest D1 Migration Plan v0.1

Date: 2026-10-04

## Objective

Replace the unconfigured Supabase browser write path for the MyNest pilot with
a same-origin Cloudflare Worker endpoint backed by D1. Preserve the existing
opt-in choice, local browser queue, privacy boundary, and MyNest UI.

## Phase 0 findings

- The public site is a static GitHub Pages deployment from this repository.
  `CNAME` is `www.springofzen.com`; no Worker currently fronts the site.
- There is no `package.json`, Wrangler configuration, Worker directory, or
  existing D1 binding in the repository.
- The only Cloudflare integration is an unrelated Python uploader for Lamp
  media in R2. It does not define a front-office Worker or reusable rate limit.
- `mynest/backend-config.js` contains blank Supabase URL/key placeholders.
- `mynest/portal.js` posts directly to Supabase PostgREST only when those
  placeholders are configured. They are not configured in the repository.
- Opted-in events are queued in localStorage under
  `mynest_room_transition_v01`. Replay currently occurs on page load and after
  each new event, oldest first. Successful events are removed. All failed HTTP
  responses remain queued. There is no online-event replay listener.
- The current production commit before this migration is `5a1159a`.
- The worktree has unrelated untracked files. They must remain untouched and
  excluded from the migration commit.

## Exact current event envelope

The browser currently creates this top-level object:

| Field | Current type and constraint |
| --- | --- |
| `event_id` | Client-generated UUID string; Supabase primary key/idempotency key |
| `household_id` | `NEST-` plus four uppercase alphanumeric characters |
| `event_type` | `diagnosis_saved`, `theme_chosen`, `plan_prepared`, `first_night_saved`, or `checkpoint_saved` |
| `step` | Integer 1–5 |
| `client_created_at` | ISO timestamp string |
| `payload` | Structured object described below |

The current structured payload permits only:

| Field | Values |
| --- | --- |
| `age_band` | `2.5–3`, `4`, `5`, `6`, or null |
| `problem_code` | `F01`–`F06`, or null |
| `theme` | `space`, `forest`, `ocean`, or null |
| `room_entry_willingness` | `easy`, `support`, `no`, or null |
| `own_room_result` | `full`, `part`, `attempt`, `none`, or null |
| `own_room_nights` | Integer 0–5 |
| `verified_transition` | Boolean |
| `readiness_confirmed` | Boolean, only for `plan_prepared` |
| `checkpoint_day` | `1`, `3`, `7`, or `14`, only for `checkpoint_saved` |
| `checkpoint_willingness` | `easy`, `support`, `no`, only for `checkpoint_saved` |
| `checkpoint_result` | `full`, `part`, `attempt`, `none`, only for `checkpoint_saved` |

The browser state also contains optional `tinyChoice`, first-night `note`, and
checkpoint `note` values. The current payload builder excludes them. The D1
API must continue excluding and explicitly rejecting those fields.

## Target design

1. Add a standalone Worker in `workers/mynest-api/` because no Worker exists.
2. Bind D1 as `MYNEST_DB` and configure migrations at
   `migrations/mynest/`.
3. Store the current envelope as typed D1 columns rather than arbitrary JSON.
   This makes the privacy boundary enforceable in both validation and schema.
4. Keep `event_id` as the client idempotency key and add a separate random
   server `id`. A duplicate `event_id` returns HTTP 200 without inserting.
5. Change the browser to same-origin `POST /api/mynest/pilot-events`.
6. Treat 2xx and duplicate delivery as success; retain network/5xx failures;
   remove permanent 4xx-invalid events so they do not retry forever.
7. Replay on load, the browser `online` event, and new event creation.
8. Enforce allowed origins, JSON content type, and a 4 KiB request limit. Do
   not store IP addresses or introduce persistent personal identifiers.
9. Keep GitHub Pages as the origin, enable Cloudflare proxying on the existing
   `www` CNAME, and attach only the narrow
   `www.springofzen.com/api/mynest/*` Worker route. Non-API paths continue to
   the existing GitHub Pages origin unchanged.

## Deployment sequence

1. Create D1 database `mynest-pilot` in APAC and capture the real ID.
2. Add Wrangler configuration without invented identifiers.
3. Add SQLite migration and Worker code/tests.
4. Run automated privacy, validation, CORS, and idempotency tests.
5. Apply the migration locally with Wrangler and run local Worker checks.
6. Inspect and apply the remote migration with Wrangler.
7. Deploy the Worker to its workers.dev hostname and verify the API there.
8. Configure the narrow `www.springofzen.com/api/mynest/*` Worker route and
   enable proxying on the existing `www` DNS record without changing its
   target.
9. Verify the production API, queue clearing, and unrelated public pages.
10. Commit and push only after all applicable tests pass.

## Rollback

- Remove the narrow Worker route and, if needed, return the existing `www`
  record to DNS-only to restore direct GitHub Pages traffic.
- Revert the frontend commit to restore local-only queuing.
- Do not delete the D1 database during rollback; retain it for audit/recovery.
- The D1 migration is additive. If the API is withdrawn, revoke the Worker
  binding or deployment rather than destructively dropping pilot records.
