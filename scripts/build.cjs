const fs = require("node:fs/promises");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
async function build() {
  const dist = path.join(root, "dist");
  if (path.relative(root, dist) !== "dist") throw new Error("Invalid build directory");
  await fs.rm(dist, { recursive: true, force: true });
  await fs.mkdir(dist, { recursive: true });
  for (const name of [
    "index.html",
    "styles.css",
    "script.js",
    "translations.js",
    "site-config.js",
    "analytics.js",
    "motion.js",
    "favicon.svg",
    "robots.txt",
    "sitemap.xml",
    "pics",
  ]) {
    await fs.cp(path.join(root, name), path.join(dist, name), {
      recursive: true,
    });
  }
  console.log("Static build ready in dist/ (not deployed).");
}
build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
