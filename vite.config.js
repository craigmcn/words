import { defineConfig } from 'vitest/config'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function serviceWorkerPlugin() {
  return {
    name: 'service-worker',
    apply: 'build',
    generateBundle() {
      const sw = readFileSync(resolve(__dirname, 'src/sw.js'), 'utf8').replace(
        '{buildtime}',
        Date.now().toString(),
      )
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: sw })
    },
  }
}

export default defineConfig(({ mode }) => ({
  root: 'src',
  base: './',
  server: { port: 3080 },
  preview: { port: 3080 },
  build: {
    outDir: mode === 'netlify' ? '../netlify' : '../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) =>
          /\.css$/i.test(assetInfo.name ?? '')
            ? 'css/[name][extname]'
            : 'assets/[name][extname]',
      },
    },
  },
  plugins: [serviceWorkerPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['../test/setup.js'],
    include: ['../test/**/*.test.js'],
    coverage: {
      provider: 'v8',
    },
  },
}))
