import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';

const isVercel = Boolean(process.env.VERCEL) || process.env.DEPLOY_TARGET === 'vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  security: {
    checkOrigin: false,
  },
  adapter: isVercel ? vercel() : node({ mode: 'standalone' }),
  vite: {
    cacheDir: '/tmp/.vite-cache',
    plugins: [tailwindcss()],
  },
});
