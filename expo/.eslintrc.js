module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['universe/native', 'universe/shared/typescript-analysis'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json'
      },
      rules: {
        'no-array-constructor': 'off'
      }
    }
  ]
};
