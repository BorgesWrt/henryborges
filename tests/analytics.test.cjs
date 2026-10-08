const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync(
  require("node:path").join(__dirname, "../analytics.js"),
  "utf8",
);
function setup({
  id = "G-TEST123",
  hostname = "henryborges.pages.dev",
  choice = null,
} = {}) {
  const nodes = new Map();
  const inserted = [];
  const events = {};
  for (const key of [
    "analytics-banner",
    "analytics-settings",
    "analytics-accept",
    "analytics-decline",
  ])
    nodes.set(key, {
      hidden: true,
      handlers: {},
      addEventListener(type, fn) {
        this.handlers[type] = fn;
      },
      focus() {},
    });
  const values = new Map(choice ? [["hb-analytics-consent", choice]] : []);
  const context = {
    window: {
      portfolioConfig: {
        gaMeasurementId: id,
        analyticsHostnames: ["henryborges.pages.dev"],
      },
    },
    location: { hostname, origin: `https://${hostname}`, pathname: "/" },
    localStorage: {
      getItem: (k) => values.get(k) ?? null,
      setItem: (k, v) => values.set(k, v),
    },
    document: {
      cookie: "",
      documentElement: { lang: "en" },
      getElementById: (k) => nodes.get(k),
      createElement: () => ({}),
      head: { append: (s) => inserted.push(s) },
      addEventListener: (t, fn) => (events[t] = fn),
      querySelectorAll: () => [],
    },
  };
  vm.runInNewContext(source, context);
  return {
    context,
    nodes,
    inserted,
    values,
    events,
    click: (k) => nodes.get(k).handlers.click(),
  };
}
test("missing ID, localhost and preview domains never initialize tracking", () => {
  for (const args of [
    { id: "" },
    { hostname: "localhost" },
    { hostname: "127.0.0.1" },
    { hostname: "preview--henryborges.pages.dev" },
  ]) {
    const s = setup({ ...args, choice: "granted" });
    assert.equal(s.inserted.length, 0);
    assert.equal(s.context.window.gtag, undefined);
    assert.equal(s.nodes.get("analytics-settings").hidden, true);
  }
});
test("Google is never loaded before consent or after an initial refusal", () => {
  const s = setup();
  assert.equal(s.inserted.length, 0);
  assert.equal(s.nodes.get("analytics-banner").hidden, false);
  s.click("analytics-decline");
  assert.equal(s.inserted.length, 0);
  assert.equal(s.values.get("hb-analytics-consent"), "denied");
  assert.equal(setup({ choice: "denied" }).inserted.length, 0);
});
test("consent loads once, emits pageview, and can be withdrawn and restored", () => {
  const s = setup();
  s.click("analytics-accept");
  assert.equal(s.inserted.length, 1);
  assert.match(s.inserted[0].src, /googletagmanager/);
  const calls = s.context.window.dataLayer.map((args) => Array.from(args));
  const config = calls.find((c) => c[0] === "config");
  assert.equal(config[2].send_page_view, true);
  assert.equal(config[2].page_location, "https://henryborges.pages.dev/");
  assert.equal(config[2].allow_google_signals, false);
  s.click("analytics-settings");
  assert.equal(s.nodes.get("analytics-banner").hidden, false);
  s.click("analytics-decline");
  assert.equal(s.context.window["ga-disable-G-TEST123"], true);
  const count = s.context.window.dataLayer.length;
  s.events["portfolio:language"]({ detail: { language: "ru" } });
  assert.equal(s.context.window.dataLayer.length, count);
  s.click("analytics-accept");
  assert.equal(s.inserted.length, 1);
  assert.equal(s.context.window["ga-disable-G-TEST123"], false);
});
