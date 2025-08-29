import { defineConfig } from 'eslint/config'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default defineConfig([{
    extends: compat.extends('eslint:recommended'),

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        ecmaVersion: 12,
        sourceType: 'module',
    },

    rules: {
        quotes: ['error', 'single'],
        semi: ['error', 'never'],

        indent: ['error', 4, {
            SwitchCase: 1,
        }],

        'no-multi-spaces': ['error'],
        'no-trailing-spaces': 'error',
        'no-console': 'warn',
        'comma-dangle': ['error', 'always-multiline'],

        'arrow-parens': ['error', 'as-needed', {
            requireForBlockBody: true,
        }],
    },
}])
