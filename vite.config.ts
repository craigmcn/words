import { defineConfig } from "vitest/config";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import type { Plugin } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

function serviceWorkerPlugin(): Plugin {
  let base = "./";
  return {
    name: "service-worker",
    apply: "build",
    configResolved(config) {
      base = config.base;
    },
    // Precache asset paths come from the base so they match what index.html
    // loads, including the root copy that loads its assets from /words/.
    generateBundle() {
      const sw = readFileSync(resolve(__dirname, "src/sw.js"), "utf8")
        .replace("{buildtime}", Date.now().toString())
        .replaceAll("{base}", base);
      this.emitFile({ type: "asset", fileName: "sw.js", source: sw });
    },
  };
}

export default defineConfig(({ mode }) => ({
  root: "src",
  // craigmcn.com/words is served before the inline script adds the slash, so
  // relative URLs would resolve against / (redirect rules can't add it). Dev,
  // preview and e2e run at /, so they keep "./".
  base: mode === "netlify" ? "/words/" : "./",
  server: { port: 3080 },
  preview: { port: 3080 },
  build: {
    outDir: mode === "netlify" ? "../netlify" : "../dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name].js",
        assetFileNames: (assetInfo) =>
          /\.css$/i.test(assetInfo.name ?? "")
            ? "css/[name][extname]"
            : "assets/[name][extname]",
      },
    },
  },
  plugins: [serviceWorkerPlugin()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["../test/setup.js"],
    include: ["../test/**/*.test.js"],
    coverage: {
      provider: "v8",
    },
  },
}));
