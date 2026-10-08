# Henry Borges · Portfolio

A static HTML/CSS/JavaScript portfolio centered on custom development and independent projects. Project cards use bundled homepage screenshots on every screen size to keep loading and scrolling stable. The published site has no runtime dependencies.

## Local review

```powershell
npm.cmd ci
npx.cmd playwright install chromium
npm.cmd run dev
```

Open `http://127.0.0.1:4173/`. Run `npm.cmd run check` for syntax, translation/content checks and analytics consent tests.

## Content and languages

Selected work: Interior Arts, Soberu and Lines of Arts (a published art-history reference covering painting movements, artists, works and teacher–student links). A separate growing site network presents Ashen Archive, ZZZ Archive and the public Elden Ring Archive PvE reference. Earlier experiments are removed from the page. Three evidence-based value propositions connect development capabilities to these projects. Platform skills include 1C-Bitrix and Bitrix24 alongside custom web development.

`translations.js` contains complete English, Russian, Spanish, Vietnamese and Simplified Chinese dictionaries, including project notes, accessible labels and analytics preferences. English is the default. The selector saves the chosen language locally and updates `?lang=en|ru|es|vi|zh` for shareable links. URL language takes priority over the saved preference. These are client-rendered translations, not five independently prerendered SEO pages; the canonical site URL stays the same.

`index.html` contains usable English content before JavaScript. `styles.css` contains responsive layouts and both themes. `script.js` handles language, theme, navigation and native accessible project dialogs.

## Automatic homepage previews

Interior Arts, Soberu, Lines of Arts, Ashen Archive, ZZZ Archive and Elden Ring Archive show bundled homepage screenshots on every screen size. The cards link to the live websites in new tabs. No iframe replaces a screenshot after page load, so a blocked or slow third-party page cannot blank a card or trigger repeated rendering.

`scripts/previews.cjs` captures all six homepages in isolated Chromium contexts, converts them to WebP and records timestamps in `pics/projects/manifest.json`. The dev server refreshes the files after six hours; reload the local page to see new captures. `npm.cmd run previews:refresh` forces an update when Playwright Chromium is installed locally. Commit refreshed screenshots to update the published cards. `npm.cmd run build` copies the saved images and other public files into `dist/` without launching Chromium; Cloudflare needs no browser installation.

Screenshots are never swapped or reloaded by client-side JavaScript. Scroll-reveal animation is disabled on screens up to 1024px to reduce paint work.

## GA4 (prepared, inactive)

Set the portfolio web stream's `gaMeasurementId` in `site-config.js` to its `G-...` ID. Do not reuse another project's ID without intentionally sharing its stream. The empty value keeps analytics and its banner disabled.

Tracking is allowed only on the exact configured production hostname. Localhost and preview traffic are excluded. The Google tag loads only after the visitor permits analytics. Visitors can reopen preferences in the footer and withdraw consent. Ad storage, ad personalization and Google signals stay disabled. Pageviews, language changes and project-note opens are measured; form contents and contact details are not sent. No message submission form is present.

If GA4 is configured, verify the stream using GA4 Realtime / Tag Assistant after granting consent. No production data has been verified. Google Analytics measurement is separate from Google Search Console indexing.

## Deployment

Cloudflare Pages is linked to `BorgesWrt/henryborges` and builds `main` with `npm run build`, publishing `dist/` at `https://henryborges.pages.dev/`. Verify the deployment and live URL after pushing updates. The earlier Netlify site is retained temporarily during migration and is not the canonical origin.

References: [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/), [Google basic consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode), [Google tag privacy settings](https://developers.google.com/tag-platform/security/guides/privacy).
