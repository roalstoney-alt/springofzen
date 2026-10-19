import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

export class MetricoolIdentityGateError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "MetricoolIdentityGateError";
    this.code = code;
  }
}

function fail(code, message) {
  throw new MetricoolIdentityGateError(code, message);
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizedAccount(value) {
  return clean(value).toLowerCase();
}

function normalizedHandle(value) {
  return clean(value).replace(/^@/, "").toLowerCase();
}

function normalizedMedia(mediaUrls = []) {
  return [...mediaUrls].map(clean).filter(Boolean).sort();
}

export function postFingerprint(post) {
  const stablePost = {
    network: clean(post?.network).toLowerCase(),
    text: clean(post?.text).replace(/\s+/g, " "),
    mediaUrls: normalizedMedia(post?.mediaUrls),
    publishAt: clean(post?.publishAt),
  };

  return createHash("sha256")
    .update(JSON.stringify(stablePost))
    .digest("hex");
}

function isUnverified(value) {
  return !clean(value) || /^(NOT_|VERIFY_)/.test(clean(value));
}

function duplicateExists(candidatePost, scheduledPosts) {
  if (!candidatePost) return false;

  const sourceId = clean(candidatePost.sourceId);
  const remoteId = clean(candidatePost.remoteId);
  const fingerprint = postFingerprint(candidatePost);

  return scheduledPosts.some((post) =>
    (sourceId && sourceId === clean(post.sourceId)) ||
    (remoteId && remoteId === clean(post.remoteId)) ||
    fingerprint === postFingerprint(post)
  );
}

export function verifyMetricoolExecution(manifest, activeState, request = {}) {
  const config = manifest?.metricool ?? {};
  const expectedAccount = normalizedAccount(config.expected_account);
  const activeAccount = normalizedAccount(activeState?.account);

  if (!activeAccount) {
    fail("IDENTITY_MISSING", "Metricool did not expose an authenticated account identity.");
  }
  if (activeAccount !== expectedAccount) {
    fail(
      "IDENTITY_MISMATCH",
      `Authenticated Metricool account ${activeAccount} does not match ${expectedAccount}.`
    );
  }
  if (activeState?.credentialValid === false) {
    fail("CREDENTIAL_EXPIRED", "The authorized Metricool credential has expired.");
  }
  if (activeState?.brandAvailable === false) {
    fail(
      "PREVIOUSLY_SUCCESSFUL_BRAND_UNAVAILABLE",
      "The previously selected MyKidsNest Metricool brand is unavailable to this identity."
    );
  }

  const expectedBrandId = clean(config.brand_id);
  const activeBrandId = clean(activeState?.brandId);
  if (isUnverified(expectedBrandId)) {
    fail("BRAND_UNVERIFIED", "The MyKidsNest brand ID has not been account-bound and verified.");
  }
  if (!activeBrandId || activeBrandId !== expectedBrandId) {
    fail(
      "BRAND_MISMATCH",
      `Active brand ${activeBrandId || "MISSING"} does not match ${expectedBrandId}.`
    );
  }

  const operation = clean(request.operation || "read").toLowerCase();
  if (!["read", "write", "schedule"].includes(operation)) {
    fail("OPERATION_NOT_ALLOWED", `${operation || "MISSING"} is not a supported Metricool operation.`);
  }
  const permission = operation === "read" ? "read" : "write";
  if (activeState?.permissions?.[permission] !== true) {
    fail(
      "OPERATION_NOT_AUTHORIZED",
      `The active Metricool connection cannot perform ${permission} operations.`
    );
  }

  const network = clean(request.network).toLowerCase();
  if (network) {
    if (!config.required_networks?.includes(network)) {
      fail("NETWORK_NOT_ALLOWED", `${network} is not a MyKidsNest required network.`);
    }

    const expectedHandle = config.intended_social_handles?.[network];
    const activeHandle = activeState?.handles?.[network];
    if (isUnverified(expectedHandle)) {
      fail("HANDLE_UNVERIFIED", `The intended ${network} handle has not been recovered.`);
    }
    if (normalizedHandle(activeHandle) !== normalizedHandle(expectedHandle)) {
      fail("HANDLE_MISMATCH", `The active ${network} handle does not match the manifest.`);
    }
    if (activeState?.networks?.[network] !== "CONNECTED") {
      fail("NETWORK_DISCONNECTED", `${network} is not connected in the verified brand.`);
    }
  }

  if (operation === "schedule" && duplicateExists(request.candidatePost, request.scheduledPosts ?? [])) {
    fail("DUPLICATE_POST", "An equivalent post is already scheduled.");
  }

  return {
    allowed: true,
    code:
      operation === "schedule"
        ? "AUTHENTICATED_SCHEDULING_ALLOWED"
        : operation === "write"
          ? "AUTHENTICATED_WRITE_ALLOWED"
          : "AUTHENTICATED_READ_ALLOWED",
    account: activeAccount,
    brandId: activeBrandId,
    network: network || null,
  };
}

export async function loadIdentityManifest(path) {
  const text = await readFile(path, "utf8");
  return JSON.parse(text);
}
