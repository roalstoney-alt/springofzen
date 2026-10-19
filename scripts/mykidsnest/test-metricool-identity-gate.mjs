import test from "node:test";
import assert from "node:assert/strict";

import {
  MetricoolIdentityGateError,
  verifyMetricoolExecution,
} from "./metricool-identity-gate.mjs";

const manifest = {
  project: "MyKidsNest",
  metricool: {
    expected_account: "youtale520@gmail.com",
    brand_id: "7419677",
    required_networks: ["pinterest", "tiktok", "instagram"],
    intended_social_handles: {
      pinterest: "mykidsnest",
      tiktok: "mykidsnest",
      instagram: "mykidsnest",
    },
  },
};

const active = {
  account: "youtale520@gmail.com",
  brandId: "7419677",
  brandAvailable: true,
  credentialValid: true,
  permissions: { read: true, write: true },
  handles: {
    pinterest: "@mykidsnest",
    tiktok: "@mykidsnest",
    instagram: "@mykidsnest",
  },
  networks: {
    pinterest: "CONNECTED",
    tiktok: "CONNECTED",
    instagram: "CONNECTED",
  },
};

const candidatePost = {
  sourceId: "MKN-FOREST-001-PIN-01",
  network: "pinterest",
  text: "A calm forest room transition.",
  mediaUrls: ["https://assets.example/forest.webp"],
  publishAt: "2026-10-20T09:00:00+08:00",
};

function expectBlocked(code, callback) {
  assert.throws(callback, (error) => {
    assert.ok(error instanceof MetricoolIdentityGateError);
    assert.equal(error.code, code);
    return true;
  });
}

test("wrong Metricool account is an identity mismatch, not a disconnected-network result", () => {
  expectBlocked("IDENTITY_MISMATCH", () =>
    verifyMetricoolExecution(manifest, { ...active, account: "roalstoney@gmail.com" })
  );
});

test("correct account with wrong brand is blocked", () => {
  expectBlocked("BRAND_MISMATCH", () =>
    verifyMetricoolExecution(manifest, { ...active, brandId: "7419165" })
  );
});

test("missing authenticated account identity is blocked", () => {
  expectBlocked("IDENTITY_MISSING", () =>
    verifyMetricoolExecution(manifest, { ...active, account: "" })
  );
});

test("previously successful brand unavailable is blocked", () => {
  expectBlocked("PREVIOUSLY_SUCCESSFUL_BRAND_UNAVAILABLE", () =>
    verifyMetricoolExecution(manifest, { ...active, brandAvailable: false })
  );
});

test("duplicate post is detected before scheduling", () => {
  expectBlocked("DUPLICATE_POST", () =>
    verifyMetricoolExecution(manifest, active, {
      operation: "schedule",
      network: "pinterest",
      candidatePost,
      scheduledPosts: [{ ...candidatePost, remoteId: "metricool-123" }],
    })
  );
});

test("expired credential is blocked", () => {
  expectBlocked("CREDENTIAL_EXPIRED", () =>
    verifyMetricoolExecution(manifest, { ...active, credentialValid: false })
  );
});

test("disconnected network is blocked only after identity, brand and handle verification", () => {
  expectBlocked("NETWORK_DISCONNECTED", () =>
    verifyMetricoolExecution(
      manifest,
      { ...active, networks: { ...active.networks, pinterest: "DISCONNECTED" } },
      { operation: "schedule", network: "pinterest", candidatePost, scheduledPosts: [] }
    )
  );
});

test("authenticated, matching and non-duplicate scheduling is allowed", () => {
  const result = verifyMetricoolExecution(manifest, active, {
    operation: "schedule",
    network: "pinterest",
    candidatePost,
    scheduledPosts: [],
  });

  assert.deepEqual(result, {
    allowed: true,
    code: "AUTHENTICATED_SCHEDULING_ALLOWED",
    account: "youtale520@gmail.com",
    brandId: "7419677",
    network: "pinterest",
  });
});
