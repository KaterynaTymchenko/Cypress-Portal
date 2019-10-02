module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {},
  extends: [
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: [
    "react",
    "react-hooks",
    "pretty-imports",
    "@typescript-eslint"
  ],
  rules: {
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/array-type": 0,
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/no-object-literal-type-assertion": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/no-parameter-properties": 0,
    "@typescript-eslint/no-unused-vars": 2,
    "multiline": {
      "delimiter": "semi",
      "requireLast": true
    },
    "singleline": {
      "delimiter": "semi",
      "requireLast": false
    },
    "max-len": ["error", {
      "code": 120
    }],
    "no-var": 2,
    "prefer-const": 1,
    "prefer-spread": 1,
    "prefer-template": 1,
    "no-duplicate-imports": 2,
    "react/jsx-uses-vars": 2,
    "react/jsx-uses-react": 2,
    "semi": 2,
    "quotes": 2,
    "pretty-imports/sorted": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
};
