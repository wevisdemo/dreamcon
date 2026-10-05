export default {
  extends: [
    '@commitlint/config-conventional',
    '@commitlint/config-pnpm-scopes',
  ],
  rules: {
    'scope-empty': [2, 'never'],
  },
};
