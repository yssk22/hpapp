module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: [
    'local-rules',
    // @typescript-eslint/no-deprecated is not working with the @typescript-eslint
    // version we are using through universe/shared/typescript-analysis so we are using
    // the eslint-plugin-deprecation plugin
    'deprecation'
  ],
  extends: ['universe/native', 'universe/shared/typescript-analysis', 'plugin:local-rules/all'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json'
      },
      rules: {
        'no-array-constructor': 'off',
        'no-console': 'error',
        'no-unused-vars': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        'deprecation/deprecation': 'error',
        'local-rules/no-internals-import': 'error',
        'local-rules/use-relative-import': 'error',
        'local-rules/inconsistent-testid': 'error',
        'local-rules/no-translation-entry': 'error'
      }
    }
  ]
};
