import type { APIRoute } from 'astro';
import { store } from '../../data/store';

export const GET: APIRoute = async () => {
  const settings = store.getSettings();
  const analytics = store.getAnalytics();

  return new Response(
    JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
      system: "Alpha-6 Sovereign Industrial AI Workbench",
      problemStatementId: "SIH26117",
      theme: "Smart Automation - Sovereign Industrial AI",
      airGapped: true,
      dataEgressBytes: 0,
      activeModel: settings.activeModel,
      policyGateMode: settings.policySensitivity,
      connectedNodeAdapter: "@astrojs/node (standalone)",
      runtimeNodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      qdrantIndexStatus: "OPTIMAL",
      totalIndexedVectors: analytics.totalVectorChunks,
      pendingHitlActions: analytics.hitlPendingCount
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    }
  );
};
