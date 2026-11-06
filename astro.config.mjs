import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://finques-millenium-demo.vercel.app',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
