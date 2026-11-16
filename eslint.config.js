import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";
export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "build/**",
      "dist/**",
      "local/**",
      "data/**",
      "local-data/**",
      "private/**",
      "secrets/**",
      ".secrets/**",
      ".auth/**",
      "auth-state/**",
      "browser-profile/**",
      "browser-state/**",
      "uploads/**",
      "photos/**",
      "pantry-images/**",
      "shopping-lists/**",
      "cart-snapshots/**",
      "runtime/**",
      "tmp/**",
      "temp/**",
      "work/**",
      "logs/**",
      ".cache/**",
      ".next/**",
      ".react-router/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      ".scratch/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["src/**/*.ts"],
  })),
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  { languageOptions: { globals: globals.node } },
  {
    files: ["app/**/*.{ts,tsx}", "tests/browser/**/*.ts"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
  prettier,
);
