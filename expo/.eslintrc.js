module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['local-rules'],
  extends: ['universe/native', 'universe/shared/typescript-analysis', 'plugin:local-rules/all'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json'
      },
      rules: {
        'no-array-constructor': 'off',
        'no-console': 'error',
        'no-unused-vars': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        'local-rules/no-internals-import': 'error',
        'local-rules/use-relative-import': 'error',
        'local-rules/inconsistent-testid': 'error',
        'local-rules/no-translation-entry': 'error'
      }
    }
  ]
};
