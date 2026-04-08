import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.extends('plugin:jsx-a11y/recommended'),
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/no-array-index-key': 'warn',
      'import/no-default-export': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*'],
              message: "don't import form inside features.",
            },
          ],
        },
      ],

      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
    },
  },
  {
    rules: {
      'import/no-default-export': 'off',
    },
    files: [
      // App Router required defaults
      'src/app/**',

      // Common config files that typically use default exports
      '**/*config.{js,ts,cjs,mjs}',
      'next.config.{js,ts,cjs,mjs}',
      'postcss.config.{js,ts,cjs,mjs}',
      'tailwind.config.{js,ts,cjs,mjs}',
    ],
  },
]

export default eslintConfig
