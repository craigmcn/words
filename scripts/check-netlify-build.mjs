// CI builds dist (base "./") and e2e runs against yarn dev, so neither sees the
// /words/ base the Netlify build uses. This checks that output directly.
import { existsSync, readFileSync } from "fs";

const errors = [];
const exists = (url) =>
  existsSync(`netlify${new URL(url, "http://x").pathname}`);

for (const page of ["netlify/index.html", "netlify/words/index.html"]) {
  const html = readFileSync(page, "utf8");
  const assets = [
    ...html.matchAll(/<(?:script|link)\b[^>]*\s(?:src|href)="([^"]+)"/g),
  ]
    .map((match) => match[1])
    .filter((url) => /\.(js|css|webmanifest)(\?|$)/.test(url));

  for (const ext of ["js", "css", "webmanifest"]) {
    if (
      !assets.some((url) =>
        new URL(url, "http://x").pathname.endsWith(`.${ext}`),
      )
    ) {
      errors.push(`${page}: no .${ext} asset found`);
    }
  }
  for (const url of assets) {
    if (!url.startsWith("/words/"))
      errors.push(`${page}: ${url} is not under /words/`);
    else if (!exists(url)) errors.push(`${page}: ${url} does not exist`);
  }
}

// The root and /words/ workers must precache the same files their page loads.
for (const [sw, dir] of [
  ["netlify/sw.js", "/"],
  ["netlify/words/sw.js", "/words/"],
]) {
  const source = readFileSync(sw, "utf8");
  if (source.includes("{base}")) errors.push(`${sw}: {base} was not replaced`);
  for (const [, url] of source.matchAll(/"([^"]+\.(?:js|css))"/g)) {
    const resolved = new URL(url, `http://x${dir}`).pathname;
    if (!resolved.startsWith("/words/"))
      errors.push(`${sw}: precaches ${resolved}, not under /words/`);
    else if (!exists(resolved))
      errors.push(`${sw}: precaches ${resolved}, which does not exist`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Netlify build: asset and precache URLs all resolve under /words/");
