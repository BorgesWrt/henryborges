const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright");
const sharp = require("sharp");
const root = path.resolve(__dirname, "..");
const manifestPath = path.join(root, "pics/projects/manifest.json");
const projects = [
  ["interior", "https://interior-arts.ru/", "interior-arts"],
  ["soberu", "https://soberu.soberu-app.workers.dev/", "soberu"],
  ["lines", "https://lines-of-arts.pages.dev/", "lines-of-arts"],
  ["ashen", "https://ashen-archive.pages.dev/", "ashen-archive"],
  ["zzz", "https://zenless-archive.pages.dev/", "zzz-archive"],
  ["elden", "https://elden-ring-archive.pages.dev/", "elden-ring-archive"],
];
const MAX_AGE = 6 * 60 * 60 * 1000;
function isStale(entry, now = Date.now()) {
  const timestamp = Date.parse(entry?.capturedAt);
  return !Number.isFinite(timestamp) || now - timestamp >= MAX_AGE;
}
let pending;
async function refresh({ force = false } = {}) {
  if (pending) return pending;
  pending = captureAll(force).finally(() => {
    pending = null;
  });
  return pending;
}
async function captureAll(force) {
  let manifest = {};
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  } catch {}
  manifest = Object.fromEntries(
    projects.filter(([id]) => manifest[id]).map(([id]) => [id, manifest[id]]),
  );
  const due = projects.filter(([id]) => force || isStale(manifest[id]));
  if (!due.length) return manifest;
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [id, url, filename] of due) {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        locale: "en-US",
      });
      try {
        const page = await context.newPage();
        const response = await page.goto(url, {
          waitUntil: "load",
          timeout: 45000,
        });
        if (!response?.ok()) throw new Error(`HTTP ${response?.status()}`);
        await page.locator("body").waitFor();
        if (id === "ashen")
          await page.getByRole("button", { name: "Decline" }).click({ timeout: 1500 }).catch(() => {});
        await page.evaluate(async () => {
          await Promise.race([
            Promise.all([
              document.fonts.ready,
              ...[...document.images]
                .filter((img) => img.getBoundingClientRect().top < innerHeight)
                .map((img) => img.decode().catch(() => {})),
            ]),
            new Promise((resolve) => setTimeout(resolve, 5000)),
          ]);
        });
        await page.waitForTimeout(1800);
        const png = await page.screenshot({
          animations: "disabled",
          timeout: 15000,
        });
        const file = `pics/projects/${filename}.webp`;
        const temporary = path.join(root, `${file}.tmp`);
        await sharp(png).webp({ quality: 85 }).toFile(temporary);
        await fs.rename(temporary, path.join(root, file));
        manifest[id] = { src: file, url, capturedAt: new Date().toISOString() };
        console.log(`Preview updated: ${id}`);
      } catch (error) {
        console.warn(`Preview retained: ${id} (${error.message})`);
      } finally {
        await context.close();
      }
    }
    await fs.writeFile(
      `${manifestPath}.tmp`,
      JSON.stringify(manifest, null, 2) + "\n",
    );
    await fs.rename(`${manifestPath}.tmp`, manifestPath);
  } finally {
    await browser.close();
  }
  return manifest;
}
module.exports = { refresh, isStale };
if (require.main === module)
  refresh({ force: true }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
