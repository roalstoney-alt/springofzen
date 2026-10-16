# MyKidsNest production release v0.5

Release date: 2026-10-16  
Source repository: `roalstoney-alt/springofzen`  
Pull request: `https://github.com/roalstoney-alt/springofzen/pull/1`  
Verified PR head: `fab3a616874b207a58d942e4e52994540eaf452d`  
Base: `main@1cb20da3e372b1bef5380c3cfa366af7403f1b75`

## Production target

- Cloudflare account: `f2e22e5cefa40fa25e8a461a149ae12c`
- Worker: `mykidsnest-site`
- Domains: `mykidsnest.com`, `www.mykidsnest.com`
- Version before release: `87e64dd7-d876-4104-ac16-c9ab139ea239`
- Rollback target: `87e64dd7-d876-4104-ac16-c9ab139ea239`
- Previous known-good version: `b855f1ea-33c4-4c64-9e1b-c620840ecfae`

## Runtime bindings

- Static assets: `ASSETS`
- Lead database: `LEADS_DB` → `mykidsnest-leads` (`4b743455-eaa0-49ee-a620-4449f1ff9398`)
- Lead hash: `LEAD_HASH_SECRET` (secret; never committed)
- Retention cron: `17 3 * * *` UTC (daily at 11:17 Asia/Shanghai)
- Policy gate: `2026-10-16-v1`
- Retention: 30 days, with scheduled deletion of expired inquiries and rate-limit keys

## Verified release gates

- Pull-request scope is limited to `sites/mykidsnest` and `docs/mykidsnest`.
- SpringOfZen routes and code are outside the release scope.
- Source, legacy, inquiry and HTTP tests: 41/41 passing.
- Static QA: 53 files checked, including 13 HTML pages and 26 raster images; no failures.
- Desktop browser QA: homepage, three world interactions and adult inquiry flow passing.
- Mobile browser QA at 390×844: homepage, three world interactions and inquiry page passing with no horizontal overflow.
- Social and marketplace publishing remain disabled.

The immutable merged commit, uploaded Worker version, deployment result, production smoke tests and remote synthetic-lead deletion are recorded in the release result returned by the production execution.
