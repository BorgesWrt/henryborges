const { test } = require("node:test");
const assert = require("node:assert/strict");
const { isStale } = require("../scripts/previews.cjs");
test("preview refresh policy handles absent, invalid, fresh and expired captures", () => {
  const now = Date.parse("2026-10-05T12:00:00Z");
  assert.equal(isStale(undefined, now), true);
  assert.equal(isStale({ capturedAt: "invalid" }, now), true);
  assert.equal(isStale({ capturedAt: "2026-10-05T11:00:00Z" }, now), false);
  assert.equal(isStale({ capturedAt: "2026-10-05T06:00:00Z" }, now), true);
});
