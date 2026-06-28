// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://bemcalculado.com.br',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        if (item.url === 'https://bemcalculado.com.br/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        }
        if (item.url.includes('/calculadoras/')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        }
        if (item.url.includes('/politica-de-privacidade') || item.url.includes('/termos-de-uso')) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        }
        return item;
      },
    }),
  ],
  compressHTML: true,
});
