import type { APIRoute } from 'astro';
import { store } from '../../data/store';

export const GET: APIRoute = async ({ url }) => {
  const search = url.searchParams.get('search') || undefined;
  const unit = url.searchParams.get('unit') || undefined;
  const category = url.searchParams.get('category') || undefined;
  const status = url.searchParams.get('status') || undefined;

  const records = store.getRecords({ search, unit, category, status });

  return new Response(JSON.stringify({ records, count: records.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, recordId, approverName, rejectReason } = body;

    if (!recordId) {
      return new Response(
        JSON.stringify({ error: 'recordId is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'approve') {
      const name = approverName || 'K. Raman (Supervisory Lead)';
      const updated = store.approveHitlAction(recordId, name);
      if (!updated) {
        return new Response(
          JSON.stringify({ error: 'Record not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({
          success: true,
          message: `Record ${recordId} action approved by ${name}. Dispatched to industrial DCS control plane.`,
          record: updated
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'reject') {
      const reason = rejectReason || 'Operator rejected operational command due to safety constraints';
      const name = approverName || 'K. Raman (Supervisory Lead)';
      const updated = store.rejectHitlAction(recordId, reason, name);
      if (!updated) {
        return new Response(
          JSON.stringify({ error: 'Record not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({
          success: true,
          message: `Record ${recordId} action rejected. Reason: ${reason}.`,
          record: updated
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Supported: approve, reject' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: 'Failed to process record request', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
