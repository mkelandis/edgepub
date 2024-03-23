/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      'src/**/*.spec.ts',
      'src/**/*.spec.js',
    ],
    exclude: [
      'src/**/node_modules/**',
      'src/**/fixtures/**',
      'src/**/dist/**',
      'src/**/build/**',
      'src/**/cypress/**',
      'src/**/coverage/**',
      'src/**/.git/**',
      'src/**/.next/**',
      'src/**/.vercel/**',
      'src/**/.vscode/**',
    ],
    globals: true,
    globalSetup: './vitest.setup.ts',
    environment: 'node',
    hookTimeout: 30000
  }
});
