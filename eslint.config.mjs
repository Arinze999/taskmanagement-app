// eslint.config.js
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // 1) Global ignores (flat config has no defaults)
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/.vercel/**',
      '**/dist/**',
      '**/coverage/**',
      'next-env.d.ts',
    ],
  },

  // 2) Next presets, restricted to source files
  ...compat.extends('next/core-web-vitals', 'next/typescript').map((c) => ({
    ...c,
    files: ['**/*.{js,jsx,ts,tsx}'],
  })),

  // 3) Your project rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
];
