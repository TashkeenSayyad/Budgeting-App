import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '.vite/build',
    sourcemap: true,
    lib: {
      entry: 'apps/desktop/electron/main.ts',
      formats: ['cjs'],
      fileName: () => 'main.js'
    },
    rollupOptions: {
      external: ['electron', 'better-sqlite3']
    }
  }
});
