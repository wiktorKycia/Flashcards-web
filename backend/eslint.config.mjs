import js from '@eslint/js'
import globals from 'globals'
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config'

const tsRecommendedRules = tsPlugin.configs.recommended.rules ?? {}

export default defineConfig([
    {
        ignores: ['generated/**', 'dist/**', 'prisma.config.ts']
    },
    {
        files: ['eslint.config.mjs'],
        languageOptions: {
            globals: globals.node
        }
    },
    js.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            globals: globals.node,
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json',
                tsconfigRootDir: process.cwd()
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin
        },
        rules: {
            ...tsRecommendedRules,
            'no-console': 'warn',
            'no-debugger': 'error',
            'eqeqeq': ['error', 'always'],
            'no-implicit-coercion': 'error',
            'no-duplicate-imports': 'error',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_' }
            ],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-misused-promises': [
                'error',
                { checksVoidReturn: false }
            ],
            '@typescript-eslint/no-floating-promises': 'error',
            'curly': ['error', 'all'],
            'no-var': 'error',
            'prefer-const': 'error',
        },
    }
])
