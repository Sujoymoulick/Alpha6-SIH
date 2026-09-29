import type { APIRoute } from 'astro';
import { INITIAL_VAULT_DOCUMENTS } from '../../data/vaultDocuments';

export const GET: APIRoute = async ({ url }) => {
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  const type = url.searchParams.get('type') || 'ALL';
  const unit = url.searchParams.get('unit') || 'ALL';
  const classification = url.searchParams.get('classification') || 'ALL';

  let results = [...INITIAL_VAULT_DOCUMENTS];

  if (search) {
    results = results.filter(doc => 
      doc.title.toLowerCase().includes(search) ||
      doc.docNumber.toLowerCase().includes(search) ||
      doc.description.toLowerCase().includes(search) ||
      doc.keyTags.some(t => t.toLowerCase().includes(search))
    );
  }

  if (type !== 'ALL') {
    results = results.filter(doc => doc.type === type);
  }

  if (unit !== 'ALL') {
    results = results.filter(doc => doc.plantUnit === unit);
  }

  if (classification !== 'ALL') {
    results = results.filter(doc => doc.classification === classification);
  }

  return new Response(JSON.stringify({
    total: results.length,
    documents: results
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
