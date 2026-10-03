import globals from "globals";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  // Vitest's root is src/, so coverage reports land in src/coverage
  { ignores: ["**/coverage/", "dist/", "netlify/"] },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 12,
      sourceType: "module",
    },
  },
  {
    files: ["test/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    rules: {
      "no-console": "warn",
    },
  },
  eslintConfigPrettier,
];
