import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@developer-landing/shared': path.resolve(__dirname, '../packages/shared/src'),
    },
  },
  test: {
    include: ['src/**/__tests__/**/*.test.ts'],
  },
});
