import type { APIRoute } from 'astro';
import { store } from '../../data/store';

export const GET: APIRoute = async () => {
  const analytics = store.getAnalytics();
  const settings = store.getSettings();

  return new Response(
    JSON.stringify({
      analytics,
      settings,
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    }
  );
};
