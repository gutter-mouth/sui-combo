module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["import", "simple-import-sort", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "next/core-web-vitals",
    "prettier",
  ],
  rules: {
    "no-console": ["error", { allow: ["warn", "info", "error"] }], //コンソール書いてることを知らせてくれる
    "no-restricted-syntax": [
      //禁止構文設定
      "error",
      { selector: "TSEnumDeclaration", message: "Don't declare enums" },
    ], // enum禁止
    "prefer-arrow-callback": "error", //コールバックにはアロー関数
    "prefer-const": "error", //変更のない変数は定数に
    "func-style": ["error", "expression"],
    "no-restricted-imports": [
      // importの制限
      "error",
      { paths: [{ name: "react", importNames: ["default"] }] },
    ],
    "react/prop-types": "off", //typescriptでチェックしてる 不要
    "react/react-in-jsx-scope": "off",
    "react/display-name": "error",
    "react-hooks/rules-of-hooks": "error", //フックのルールをチェック
    "react-hooks/exhaustive-deps": "warn", //effectの依存関係をチェック
    "import/newline-after-import": "error", // import後に空行作る
    "import/no-default-export": "error", //default export禁止
    "simple-import-sort/imports": "error", // import 並び替え
    "simple-import-sort/exports": "error", // export 並び替え
    "@typescript-eslint/no-explicit-any": "off", //any を許す、警告出す?
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
  overrides: [
    {
      files: ["src/pages/**/*.tsx"],
      rules: { "import/no-default-export": "off" },
    },
  ],
};
