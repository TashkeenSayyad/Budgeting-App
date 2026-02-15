import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '.vite/build',
    sourcemap: true,
    lib: {
      entry: 'apps/desktop/electron/preload.ts',
      formats: ['cjs'],
      fileName: () => 'preload.js'
    },
    rollupOptions: {
      external: ['electron']
    }
  }
});
