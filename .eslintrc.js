module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    camelcase: 0,
    'space-before-function-paren': 0,
    eqeqeq: 0,
    'dot-notation': 0,
    'no-unused-vars': 0
  }
}
