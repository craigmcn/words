import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

const indexHtml = readFileSync(
  resolve(process.cwd(), "src/index.html"),
  "utf-8",
);
const script = indexHtml.match(/<script>(.*?)<\/script>/s)?.[1];

// Runs the real inline script against a fake location, since jsdom can't
// navigate. Returns the URL it redirected to, or null.
function redirectFor(url) {
  const { pathname, search, hash } = new URL(url, "https://example.com");
  const replace = vi.fn();
  new Function("window", script)({
    location: { pathname, search, hash, replace },
  });
  return replace.mock.calls[0]?.[0] ?? null;
}

describe("trailing-slash redirect", () => {
  it("finds the inline script", () => {
    expect(script).toBeTruthy();
  });

  it.each([
    ["/words", "/words/"],
    ["/words?x=1", "/words/?x=1"],
    ["/words?x=1#top", "/words/?x=1#top"],
    ["/words#top", "/words/#top"],
  ])("redirects %s to %s", (from, to) => {
    expect(redirectFor(from)).toBe(to);
  });

  it.each(["/", "/words/", "/words/?x=1", "/words/index.html", "/index.html"])(
    "leaves %s alone",
    (url) => {
      expect(redirectFor(url)).toBeNull();
    },
  );
});
