/// <reference types="vitest" />

import path from 'path';

import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';
import removeConsole from 'vite-plugin-remove-console';

export default defineConfig((env) => {
  const isDevelopment = env.mode === 'development';

  return {
    plugins: [
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      checker({
        typescript: true,
        overlay: { initialIsOpen: false, position: 'br' },
        eslint: false,
        enableBuild: false,
      }),
      react(),
      eslint({
        fix: true,
        emitWarning: true,
        emitError: true,
        failOnError: true,
        failOnWarning: false,
        exclude: ['node_modules/**', 'dist/**', '.husky', 'build/**', 'public/**'],
        useEslintrc: true,
        cache: true,
        ignorePath: './.eslintignore',
      }),
      removeConsole(),
      splitVendorChunkPlugin(),
    ],

    server: {
      open: isDevelopment,
      hmr: {
        overlay: isDevelopment,
      },
      // https: true,
      watch: {
        usePolling: true,
      },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
    build: {
      chunkSizeWarningLimit: 5000,
    },

    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/tests/setup.ts'],
    },
  };
});
