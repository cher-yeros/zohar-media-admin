module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
  plugins: ["react-refresh"],
  rules: {
    // TS provides props typing; prop-types is redundant/noisy.
    "react/prop-types": "off",

    // This codebase mixes components + helpers in the same file.
    // Re-enable later if you want stricter Fast Refresh constraints.
    "react-refresh/only-export-components": "off",

    // Avoid blocking lint on JSX quotes.
    "react/no-unescaped-entities": "off",

    // Apollo + GraphQL responses are not strongly typed yet; keep lint usable.
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-floating-promises": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
