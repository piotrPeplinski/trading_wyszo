import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored verbatim from the @bklit shadcn registry. Not ours to lint:
    // any fix here is overwritten by the next `shadcn add @bklit/*`.
    "components/charts/**",
  ]),
]);

export default eslintConfig;
