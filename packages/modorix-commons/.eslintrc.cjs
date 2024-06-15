/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@modorix/eslint-config/index.js', 'plugin:react-hooks/recommended'],
  parserOptions: {
    project: true,
  },
};
