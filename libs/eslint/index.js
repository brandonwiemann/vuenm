const tseslint = require('typescript-eslint');
const pluginVue = require('eslint-plugin-vue');
const { configs } = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const globals = require('globals');
const importPlugin = require('eslint-plugin-import');

const typescriptConfig = defineConfig({
  name: 'echosys/typescript',
  files: ['**/*.ts', '**/*.vue'],
  extends: [configs.recommended, tseslint.configs.recommended, importPlugin.flatConfigs.recommended],
  settings: {
    'import/resolver': {
      'typescript': true
    },
  },
  rules: {
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'comma-spacing': ['error', {'before': false, 'after': true }],
    'curly': ['error', 'all'],
    'eol-last': 'off',
    'indent': ['error', 2, {
      'ignoredNodes': ['PropertyDefinition'],
      'SwitchCase': 1
    }],
    'linebreak-style': ['warn', 'unix'],
    'no-array-constructor': 'off',
    'no-case-declarations': 'off',
    'no-duplicate-imports': ['error'],
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': 'off',
    'import/no-unresolved': 'off',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-duplicate-enum-values': 'error',
    '@typescript-eslint/no-empty-object-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    '@typescript-eslint/no-unsafe-declaration-merging': 'error',
    '@typescript-eslint/no-unsafe-function-type': 'error',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', {
      'vars': 'all',
      'varsIgnorePattern': '^_',
      'args': 'all',
      'argsIgnorePattern': '^_',
      'caughtErrors': 'all',
      'caughtErrorsIgnorePattern': '^_',
      'ignoreRestSiblings': true,
    }],
    '@typescript-eslint/no-wrapper-object-types': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/triple-slash-reference': 'error'
  }
});

const vueConfig = defineConfig(typescriptConfig, {
  name: 'echosys/vue',
  extends: [pluginVue.configs['flat/recommended']],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.browser,
    },
    parserOptions: {
      parser: tseslint.parser,
    }
  },
  rules: {
    'vue/attributes-order': 'warn',
    'vue/block-order': 'warn',
    'vue/no-lone-template': 'warn',
    'vue/no-multiple-slot-args': 'warn',
    'vue/no-required-prop-with-default': 'warn',
    'vue/no-v-html': 'warn',
    'vue/order-in-components': 'warn',
    'vue/this-in-template': 'warn',
    'vue/first-attribute-linebreak': ['error', {
      'singleline': 'beside',
      'multiline': 'below'
    }],
    'vue/singleline-html-element-content-newline': ['off'],
    'vue/max-attributes-per-line': ['error', {
      'singleline': { 'max': 4 },
      'multiline': { 'max': 1 }
    }],
    'vue/html-self-closing': ['error', {
      'html': {
        'void': 'any',
        'normal': 'any',
        'component': 'always'
      },
      'svg': 'always',
      'math': 'always'
    }],
    'vue/require-default-prop': 'off',
    'vue/html-closing-bracket-newline': ['error', {
      'singleline': 'never',
      'multiline': 'always'
    }],
    'vue/html-indent': ['error', 2, {
      'attribute': 1,
      'baseIndent': 1,
      'closeBracket': 0,
      'alignAttributesVertically': false,
      'ignores': []
    }]
  }
});

const cnfigs = {
  vue: vueConfig,
  typescript: typescriptConfig,
}

module.exports = {
  configs
};
