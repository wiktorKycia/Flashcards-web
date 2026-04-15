import js from '@eslint/js'
import globals from 'globals'
import tsPlugin from '@typescript-eslint/eslint-plugin';
import { defineConfig } from 'eslint/config'

export default defineConfig([
    js.configs.recommended,
    ...tsPlugin.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            globals: globals.node
        },
        rules: {
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
