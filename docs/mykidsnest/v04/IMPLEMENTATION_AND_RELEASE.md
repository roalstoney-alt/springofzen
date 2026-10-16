# MyKidsNest v0.4 candidate

Status: REVIEW CANDIDATE — NOT DEPLOYED. Baseline: `1cb20da3e372b1bef5380c3cfa366af7403f1b75`. Verified source path: `sites/mykidsnest`. The uploaded original handoff matches this checkout byte-for-byte before edits. The existing Worker is `mykidsnest-site`, account `f2e22e5cefa40fa25e8a461a149ae12c`. The handoff reports production version `87e64dd7-d876-4104-ac16-c9ab139ea239`; it has NOT been freshly reverified in this environment.

## Result

Added a visible homepage parent entry, nonintrusive parent sections after the original room experience, an adult design directory/inquiry page, and About/Contact/Privacy/Safety/FAQ/Terms pages. Metadata uses original approved local imagery. Existing world runtime JS/CSS, all 26 raster images and other original static assets remain byte-identical (36 frozen files). Original experiences are not rebuilt. Only MyKidsNest source and docs change; legacy MyNest source and deployment configuration remain unchanged.

The inquiry implementation has a same-origin JSON endpoint, signed short-lived form challenge, strict field allowlist, explicit adult consent/current policy, bounded room inputs, no child/free-text/photo fields, honeypot, keyed short-lived network rate buckets, idempotency/content deduplication, honest confirmation/failure/offline states, no-store responses and a 30-day retention migration. No public read/export/admin endpoint exists. Authorized Cloudflare D1 access is the only administrative storage path; restrict its account permissions to the owner/operators.

Collection is disabled by default. No D1 production binding, secret, marketing integration, notification channel, new Worker or Cron Trigger has been created. No real inquiry has been transmitted or stored. Owner must approve notice/contact practices, recipient responsibility, retention/backups, scope and legal/business facts before enabling collection. No invented email address, legal entity, physical stock, price or turnaround is published.

The source-controlled migration and operator runbook are prepared; a missing database/secret/policy/retention flag causes HTTP 503 and no submission. The original production configuration remains unchanged. Do not treat the closed candidate's successful build as a verified production lead flow.

## Validation performed

- Original static QA before edits: 43 files, 5 HTML, 26 raster images, no failures.
- Extended static QA: 53 files, 13 HTML, 26 raster images, no failures. Its only network exception is the new adult script's two fixed same-origin inquiry endpoints. World scripts retain the no-network restriction.
- Original legacy suite: 22 tests passed after including its original sparse-checkout dependencies; no legacy file was modified.
- New inquiry tests: 12, using the actual migration and real SQLite, cover storage, consent, validation, duplicate/reference conflicts, origin, content type, size, spam limits, failures/no-PII logging and cleanup.
- New source regression tests: 6, covering frozen assets, boundary scope, old Worker route/header/alias/method/404 equivalence, same-origin metadata, adult form and sitemap restrictions. The intended CSP change is `form-action 'none'` to `'self'`; other security controls are retained.
- Local HTTP integration: 1, with synthetic data, confirms rendered route responses, signed challenge, successful submit/storage receipt, matching database record, duplicate handling, validation/consent rejection and removal of the synthetic record. It uses a clearly labeled Node review adapter with SQLite, NOT the Cloudflare edge runtime.
- Wrangler 4.147.0 deploy dry run: PASS with ASSETS only, no deployment.
- Wrangler local D1 migration: PASS (5 SQL statements). Wrangler's native local HTTP server could not start: `uv_interface_addresses` system error, including the loopback retry.
- Browser review could not reach this container's local loopback (`ERR_CONNECTION_REFUSED`). Desktop/mobile visual, reduced-motion runtime, slow-network/in-app and rendered provider share previews are NOT VERIFIED here. Responsive/reduced-motion source checks pass, which is not a browser test.
- Cloudflare `whoami`: unauthenticated. No deployment/version/rollback API call or temporary-preview-account deployment was attempted.

## Release gates still open

1. Restore authorized access to the existing Cloudflare account; never deploy through a new temporary account or Worker.
2. Freshly verify account, routes, production version and authorized rollback capability. Handoff evidence is historical, not a current lease on production.
3. Run desktop/mobile/reduced-motion/slow-network checks in a reachable trusted local runtime. Verify actual rendered share previews after approved deployment.
4. Approve owner-specific privacy/contact/retention practices and the deployment candidate. Review service/age/fulfillment facts before any paid offer; no unapproved v0.3 draft image is exposed publicly.
5. Configure the verified D1 binding and secret, retention job and monitoring; apply migration while collection remains disabled. Test storage before enablement.
6. Obtain explicit human deployment approval per `MYKIDSNEST_WORKSPACE_CONTINUATION_v0.4.md`: “Deployment requires explicit human approval.” Source recovery and an instruction to continue do not complete that release gate.
7. Deploy only this reviewed MyKidsNest candidate and run the production end-to-end/legacy checks. `LEAD_FLOW_VERIFIED` remains NO until then.

Source references used for migration design: https://developers.cloudflare.com/d1/reference/migrations/ and https://developers.cloudflare.com/d1/worker-api/d1-database/ . No extra runtime dependency is introduced.
