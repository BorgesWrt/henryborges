const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const context = { window: {} };
vm.runInNewContext(
  fs.readFileSync(path.join(root, "translations.js"), "utf8"),
  context,
);
const translations = context.window.portfolioTranslations;
const keys = Object.keys(translations.en).sort();
test("all five languages contain every translation and all case features", () => {
  assert.deepEqual(Object.keys(translations).sort(), [
    "en",
    "es",
    "ru",
    "vi",
    "zh",
  ]);
  for (const [language, dict] of Object.entries(translations)) {
    assert.deepEqual(Object.keys(dict).sort(), keys, language);
    for (const key of keys) {
      assert.ok(dict[key]?.length, `${language}:${key}`);
      if (key.endsWith("Features")) assert.equal(dict[key].length, 4);
    }
  }
  for (const match of html.matchAll(/data-i18n(?:-aria|-alt)?="([^"]+)"/g))
    assert.ok(keys.includes(match[1]), match[1]);
});
test("every local asset and section link resolves, and external links are safe", () => {
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const value = match[1];
    if (value.startsWith("#"))
      assert.ok(html.includes(`id="${value.slice(1)}"`), value);
    else if (!/^(https?:|mailto:|tel:)/.test(value))
      assert.ok(fs.existsSync(path.join(root, value)), value);
  }
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g))
    assert.match(match[0], /rel="noopener noreferrer"/);
  assert.doesNotMatch(html, /Lorem ipsum|href=""|href="#"/i);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
});
