import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

const indexHtml = readFileSync(
  resolve(process.cwd(), "src/index.html"),
  "utf-8",
);
// Picked by content, not position, so another inline script can't stand in.
const script = [...indexHtml.matchAll(/<script\b[^>]*>(.*?)<\/script>/gs)]
  .map((match) => match[1])
  .find((body) => body.includes("location.replace"));

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
  it("finds the redirect script", () => {
    expect(script).toBeDefined();
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
