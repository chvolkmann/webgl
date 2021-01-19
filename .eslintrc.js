module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier'],
  rules: {
    'import/no-mutable-exports': 'off',
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-vars': 'warn',
    'prettier/prettier': 'warn',
    'unicorn/number-literal-case': 'off',
    'no-async-promise-executor': 'off',
    'require-await': 'off',
    'no-useless-constructor': 'off',
    'nuxt/no-globals-in-created': 'off',
  },
}
