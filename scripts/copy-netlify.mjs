import { cpSync, mkdirSync, readdirSync } from 'fs'

mkdirSync('netlify/words', { recursive: true })
for (const entry of readdirSync('netlify')) {
  if (entry === 'words') continue
  cpSync(`netlify/${entry}`, `netlify/words/${entry}`, { recursive: true })
}
