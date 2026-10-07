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

Selected work: Interior Arts, Soberu and Lines of Arts (a published art-history reference covering painting movements, artists, works and teacher–student links). A separate growing site network presents Ashen Archive, ZZZ Archive and Elden Ring (in development, with no public link). Earlier experiments are removed from the page. Three evidence-based value propositions connect development capabilities to these projects. Platform skills include 1C-Bitrix and Bitrix24 alongside custom web development.

`translations.js` contains complete English, Russian, Spanish, Vietnamese and Simplified Chinese dictionaries, including project notes, accessible labels and analytics preferences. English is the default. The selector saves the chosen language locally and updates `?lang=en|ru|es|vi|zh` for shareable links. URL language takes priority over the saved preference. These are client-rendered translations, not five independently prerendered SEO pages; the canonical site URL stays the same.

`index.html` contains usable English content before JavaScript. `styles.css` contains responsive layouts and both themes. `script.js` handles language, theme, navigation and native accessible project dialogs.

## Automatic homepage previews

Interior Arts, Soberu, Lines of Arts, Ashen Archive and ZZZ Archive show bundled homepage screenshots on every screen size. The cards link to the live websites in new tabs. No iframe replaces a screenshot after page load, so a blocked or slow third-party page cannot blank a card or trigger repeated rendering.

`scripts/previews.cjs` captures all five homepages in isolated Chromium contexts, converts them to WebP and records timestamps in `pics/projects/manifest.json`. The dev server refreshes the files after six hours; reload the local page to see new captures. `npm.cmd run previews:refresh` forces an update when Playwright Chromium is installed locally. Commit refreshed screenshots to update the published cards. `npm.cmd run build` copies the saved images and other public files into `dist/` without launching Chromium; Netlify needs no browser installation. Publication remains on hold.

Screenshots are never swapped or reloaded by client-side JavaScript. Scroll-reveal animation is disabled on screens up to 1024px to reduce paint work.

## GA4 (prepared, inactive)

Set the portfolio web stream's `gaMeasurementId` in `site-config.js` to its `G-...` ID. Do not reuse another project's ID without intentionally sharing its stream. The empty value keeps analytics and its banner disabled.

Tracking is allowed only on the exact configured production hostname. Localhost and preview traffic are excluded. The Google tag loads only after the visitor permits analytics. Visitors can reopen preferences in the footer and withdraw consent. Ad storage, ad personalization and Google signals stay disabled. Pageviews, language changes and project-note opens are measured; form contents and contact details are not sent. No message submission form is present.

After publication is separately approved, verify the stream using GA4 Realtime / Tag Assistant after granting consent. No production data has been verified during local review. Google Analytics measurement is separate from Google Search Console indexing.

## Publication is on hold

Repository content can be updated on `main` without publishing it. `scripts/ignore-build.cjs` currently skips all Netlify builds, including `main`; Git commits and the draft PR title also carry `[skip netlify]`. Keep this publication hold until the owner approves deployment, then deliberately update the ignore script and verify the production build. The current production site is separate from the files in GitHub.

References: [Netlify deploy skipping](https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/), [Netlify ignore builds](https://docs.netlify.com/build/configure-builds/ignore-builds/), [Google basic consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode), [Google tag privacy settings](https://developers.google.com/tag-platform/security/guides/privacy).
