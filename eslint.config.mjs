import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import parser from 'svelte-eslint-parser';
import sveltePlugin from 'eslint-plugin-svelte';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [
	{
		ignores: [
			'**/.DS_Store',
			'**/node_modules',
			'build',
			'.svelte-kit',
			'package',
			'**/.env',
			'**/.env.*',
			'!**/.env.example',
			'**/pnpm-lock.yaml',
			'**/package-lock.json',
			'**/yarn.lock',
			'.wrangler'
		]
	},
	...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'),
	...sveltePlugin.configs['flat/recommended'].map((config, index) =>
		index === 2 ? { ...config, files: ['**/*.svelte'] } : config
	),
	{
		plugins: {
			'@typescript-eslint': typescriptEslint
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},

			parser: tsParser,
			ecmaVersion: 2020,
			sourceType: 'module',

			parserOptions: {
				extraFileExtensions: ['.svelte']
			}
		},

		rules: {
			'no-irregular-whitespace': ['off'],
			'@typescript-eslint/no-unused-expressions': ['off'],
			'no-unused-expressions': [
				'error',
				{
					allowShortCircuit: true,
					allowTernary: true,
					allowTaggedTemplates: true
				}
			]
		}
	},
	{
		files: ['**/*.svelte'],

		languageOptions: {
			parser: parser,
			ecmaVersion: 5,
			sourceType: 'script',

			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		},

		rules: {
			'svelte/no-inner-declarations': ['error', 'functions', { blockScopedFunctions: 'allow' }],
			'svelte/no-navigation-without-resolve': ['error', { ignoreLinks: true }]
		}
	}
];
