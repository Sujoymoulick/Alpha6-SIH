import type { APIRoute } from 'astro';
import { store } from '../../../data/store';

export const POST: APIRoute = async () => {
  const result = store.resetToDefaults();

  return new Response(
    JSON.stringify(result),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    }
  );
};
