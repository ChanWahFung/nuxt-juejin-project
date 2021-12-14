module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'nuxt/no-cjs-in-config': 'off',
    'quotes': 'off',
    'semi': 'off',
    'space-before-function-paren': 'off',
    'indent': 'off',
    'no-tabs': 'off',
    'comma-dangle': 'off',
    'eol-last': 'off',
    'arrow-parens': 'off',
    'no-console': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'no-trailing-spaces': 'off',
    'prefer-const': 'off',
    'eqeqeq': 'off',
    'quote-props': 'off',
    'space-before-blocks': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/attributes-order': 'off',
    'vue/order-in-components': 'off',
    'vue/html-self-closing': 'off',
    'vue/no-v-html': 'off',
    'no-multi-spaces': 'off',
    'object-shorthand': 'warn',
    'no-unused-vars': 'warn',
    'camelcase': 'off',
    "vue/comment-directive": 'off',
  }
}
