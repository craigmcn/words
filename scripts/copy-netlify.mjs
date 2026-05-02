import { cpSync } from 'fs'
cpSync('netlify', 'netlify/words', { recursive: true })
