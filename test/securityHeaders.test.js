import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const indexHtml = readFileSync(
  resolve(process.cwd(), "src/index.html"),
  "utf-8",
);
const netlifyToml = readFileSync(
  resolve(process.cwd(), "netlify.toml"),
  "utf-8",
);

// Only the script-src directive counts: a hash anywhere else in the file
// (a comment, another directive) wouldn't let the browser run the script.
function scriptSrcSources(toml) {
  const csp = toml.match(/^\s*Content-Security-Policy\s*=\s*"([^"]*)"/m)?.[1];
  const directive = csp
    ?.split(";")
    .map((part) => part.trim().split(/\s+/))
    .find(([name]) => name === "script-src");
  return directive ? directive.slice(1) : [];
}

async function sha256Base64(text) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return btoa(String.fromCharCode(...new Uint8Array(digest)));
}

// Any <script> without a src attribute is inline, whatever else it has.
// `\s` before src keeps data-src from counting; HTML names ignore case.
function inlineScripts(html) {
  return [
    ...html.matchAll(/<script\b(?![^>]*\ssrc\b)[^>]*>(.*?)<\/script\s*>/gis),
  ].map((match) => match[1]);
}

// The CSP allows index.html's inline scripts by hash, so any edit to one
// must update netlify.toml too, or browsers will block it.
describe("Content-Security-Policy", () => {
  it("allows every inline script in index.html by its hash", async () => {
    const scripts = inlineScripts(indexHtml);
    expect(scripts.length).toBeGreaterThan(0);

    const expected = await Promise.all(
      scripts.map(async (script) => `'sha256-${await sha256Base64(script)}'`),
    );
    const allowed = scriptSrcSources(netlifyToml).filter((source) =>
      source.startsWith("'sha256-"),
    );
    // Exact match also catches stale hashes left behind after an edit.
    expect(allowed.sort()).toEqual([...new Set(expected)].sort());
  });

  it("reads script-src only from the CSP header value", () => {
    const toml = [
      "# 'sha256-inComment='",
      `  Content-Security-Policy = "default-src 'self'; script-src 'self' 'sha256-real='; style-src 'sha256-wrong='"`,
    ].join("\n");

    expect(scriptSrcSources(toml)).toEqual(["'self'", "'sha256-real='"]);
  });

  it("finds inline scripts whatever their attributes or case", () => {
    const html = [
      "<script>bare()</script>",
      '<script id="probe">withId()</script>',
      '<script data-src="x">dataSrc()</script>',
      "<SCRIPT>upper()</SCRIPT>",
      "<script>spaced()</script >",
      '<script type="module" src="/main.js"></script>',
      '<script src = "/spaced.js"></script>',
      '<script SRC="/upper.js"></script>',
    ].join("\n");

    expect(inlineScripts(html)).toEqual([
      "bare()",
      "withId()",
      "dataSrc()",
      "upper()",
      "spaced()",
    ]);
  });

  // These would all need 'unsafe-inline'; use CSS classes and
  // addEventListener in the bundled code instead.
  it("has no inline styles or event handlers in index.html", () => {
    expect(indexHtml).not.toMatch(/\sstyle\s*=/i);
    expect(indexHtml).not.toMatch(/<style\b/i);
    expect(indexHtml).not.toMatch(/\son[a-z]+\s*=/i);
  });
});
