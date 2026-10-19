# MyKidsNest Metricool execution identity recovery

Date: 2026-10-19 (Asia/Shanghai)

Status: `AUTHORIZATION_BLOCKED`

Publishing: `NOT_RESUMED`

## Decision

The MyKidsNest Metricool identity cannot yet be system-verified. No Metricool scheduling or publishing was performed. The available connector resolves brand `7419165`; a separately authenticated browser session exposes brand `7419677` with `userId=5765860`; and the connector receives `403 Access denied` when asked to read scheduled posts for `7419677`. Neither interface exposed an email address that binds the owner-confirmed account to the observed browser brand.

This is an identity/authorization mismatch. It is not evidence that MyKidsNest's Pinterest, TikTok or Instagram networks are disconnected.

## Evidence register

| Evidence | Value | Classification |
| --- | --- | --- |
| Expected Metricool account | `youtale520@gmail.com` | `OWNER_CONFIRMED` |
| Incorrect account | `roalstoney@gmail.com` | `OWNER_CONFIRMED` |
| Available connector brand | `7419165` | `SYSTEM_VERIFIED_IN_CURRENT_CONNECTOR_CONTEXT` |
| Networks shown for connector brand | none | `SYSTEM_VERIFIED_ONLY_FOR_BRAND_7419165` |
| Authenticated browser URL | `.../brandSummary?blogId=7419677&userId=5765860` | `SYSTEM_OBSERVED` |
| Browser brand candidate | `7419677` | `SYSTEM_OBSERVED_NOT_ACCOUNT_BOUND` |
| Connector read of candidate brand | `403 Access denied to blog: '7419677'` | `SYSTEM_VERIFIED` |
| Active authenticated email | not exposed | `UNKNOWN` |
| Intended social handles | not recovered | `UNKNOWN` |
| Networks on candidate brand | not readable through authorized connector | `UNKNOWN` |

`7419677` is the only observed candidate for the last-known-good MyKidsNest brand, but it must not be promoted to `CURRENT_VERIFIED_BRAND_ID` until its account email, handles and permissions are verified together.

## Last-known-good recovery

- Metricool account identity: `youtale520@gmail.com` is owner-confirmed; no system surface exposed the active email.
- Brand ID: candidate `7419677`, observed in an authenticated browser session, account binding not verified.
- Connected networks and handles: not recovered. The empty network list for brand `7419165` is not transferred to MyKidsNest.
- Last successful MyKidsNest Metricool read/write: not recovered from project records. The current audit successfully read brand settings only for the non-accepted connector context `7419165`; no write was attempted.
- Scheduled post IDs and URLs: not recovered. Candidate-brand schedule access was denied, so duplicate status remains unknown.
- Last successful execution timestamp: not recovered.
- Credential source identifiers: `CHATGPT_METRICOOL_CONNECTOR` and `IAB_METRICOOL_SESSION_USER_5765860`. These are identifiers only; no token or password is stored.

## Existing assets and queues

The repository contains 26 source-controlled, release-QA-checked world raster assets: 10 Ocean, 10 Space and 6 Forest. Project policy describes this imagery as approved for the original site and metadata, not as blanket approval for a new social post.

The existing source queue at `data/mynest/platform-content-queue.json` contains three human-review items (`V011-REDDIT-ANSWER-001`, `V011-SEO-001`, `V011-PAID-ANGLE-001`) and explicitly sets external posting to `DISABLED`. It is not a Metricool publishing queue.

Historical October content records describe incomplete packages, not publishable scheduled items:

- 2026-10-17: a dinosaur-room repurpose package had copy/shot-list material but no approved original visual in that execution.
- 2026-10-18: the weekly review reported no scheduled social posts.
- 2026-10-19: an ocean package had briefs/prompts/copy, while generated images and videos remained zero.

Because the correct schedule cannot be read, duplicate detection cannot be completed against live state. No incomplete publishing step was resumed.

## Historical report corrections

The original October 17–19 reports remain unchanged in their historical source. Three append-only correction events are stored in `data/mykidsnest/metricool-status-corrections.jsonl`. Each replaces unsupported account-level connection conclusions with:

`METRICOOL_CONNECTION_STATUS = UNVERIFIED_IN_CORRECT_ACCOUNT`

No correction asserts that a blocked or draft post was published.

## Identity gate

The project manifest is `config/mykidsnest/metricool-execution-identity.yaml`. It is JSON-formatted YAML 1.2 so the gate can load it without a production dependency. It contains no secrets.

Before a read or write, the gate requires:

1. an exposed authenticated email equal to the expected account;
2. an account-bound brand ID equal to the manifest;
3. the intended handle for a requested network;
4. the required read/write permission and network connection; and
5. a duplicate check against the current scheduled-post list before scheduling.

Any missing identity or mismatch blocks the operation. The gate never substitutes another authenticated account and never converts an identity mismatch into a network-disconnected conclusion.

## Precise authorization blocker

The existing ChatGPT Metricool connector must be authorized as `youtale520@gmail.com`, and it must expose or otherwise verifiably bind that identity to candidate brand `7419677`. A subsequent read must verify the Pinterest, TikTok and Instagram handles, read/write permissions, and existing schedule. Until all of those checks pass, `brand_id` remains `VERIFY_FROM_LAST_KNOWN_GOOD` and publishing stays blocked.

## Required output

```makefile
PROJECT = MYKIDSNEST
EXPECTED_ACCOUNT = youtale520@gmail.com
ACTIVE_ACCOUNT = SYSTEM_UNVERIFIED
IDENTITY_MATCH = UNVERIFIED

LAST_KNOWN_GOOD_BRAND_ID = 7419677 (SYSTEM_OBSERVED_BROWSER_SESSION; ACCOUNT_BINDING_UNVERIFIED)
CURRENT_VERIFIED_BRAND_ID = NONE

PINTEREST_CONNECTION = NOT_VERIFIED_IN_CORRECT_ACCOUNT
TIKTOK_CONNECTION = NOT_VERIFIED_IN_CORRECT_ACCOUNT
INSTAGRAM_CONNECTION = NOT_VERIFIED_IN_CORRECT_ACCOUNT

PREVIOUS_SUCCESSFUL_POST_ID = NOT_RECOVERED
EXISTING_SCHEDULED_POSTS = NOT_VERIFIED_ACCESS_DENIED

REPORT_CORRECTIONS = 3_APPEND_ONLY_EVENTS
DUPLICATES_PREVENTED = 0_LIVE_ACTIONS; 1_SYNTHETIC_DUPLICATE_BLOCK_TEST_PASS
TEST_RESULTS = 8/8_IDENTITY_GATE_PASS; 22/22_EXISTING_BACKEND_PASS

PUBLISHING_RESUMED = NO
REMAINING_BLOCKERS = AUTHORIZE_EXPECTED_ACCOUNT; BIND_AND_VERIFY_BRAND_7419677; VERIFY_HANDLES_PERMISSIONS_AND_SCHEDULE
```
