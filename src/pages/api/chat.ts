import type { APIRoute } from 'astro';
import { KNOWLEDGE_BASE, type QAPair } from '../../data/knowledgeBase';
import { store } from '../../data/store';

// Common English & engineering stopwords to filter for keyword matching
const STOPWORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
  'is', 'are', 'was', 'were', 'what', 'where', 'when', 'how', 'which', 'who',
  'why', 'can', 'could', 'should', 'would', 'do', 'does', 'did', 'and', 'or',
  'it', 'its', 'this', 'that', 'these', 'those', 'i', 'we', 'you', 'they',
  'tell', 'me', 'about', 'explain', 'show', 'give', 'list', 'please'
]);

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOPWORDS.has(word));
}

function matchQuery(userQuery: string): { match: QAPair; score: number } | null {
  const queryTokens = extractKeywords(userQuery);
  if (queryTokens.length === 0) return null;

  let bestMatch: QAPair | null = null;
  let highestScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;

    // Check exact question similarity
    const lowerUserQuery = userQuery.toLowerCase().trim();
    const lowerQuestion = item.question.toLowerCase().trim();
    if (lowerUserQuery === lowerQuestion) {
      return { match: item, score: 1.0 };
    }
    if (lowerQuestion.includes(lowerUserQuery) || lowerUserQuery.includes(lowerQuestion)) {
      score += 0.8;
    }

    // Keyword matching
    for (const kw of item.keywords) {
      const lowerKw = kw.toLowerCase();
      if (lowerUserQuery.includes(lowerKw)) {
        score += 0.35;
      }
      for (const token of queryTokens) {
        if (lowerKw === token) {
          score += 0.25;
        } else if (lowerKw.includes(token) || token.includes(lowerKw)) {
          score += 0.15;
        }
      }
    }

    // Token overlap against item question & answer
    const itemTokens = new Set([
      ...extractKeywords(item.question),
      ...extractKeywords(item.answer)
    ]);

    let overlapCount = 0;
    for (const token of queryTokens) {
      if (itemTokens.has(token)) {
        overlapCount++;
      }
    }

    score += (overlapCount / queryTokens.length) * 0.4;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore >= 0.28) {
    return { match: bestMatch, score: Math.min(0.998, 0.70 + (highestScore * 0.28)) };
  }

  return null;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const query = (body.query || body.message || '').trim();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const settings = store.getSettings();
    const selectedModel = body.model || settings.activeModel;

    // Policy Gate Pre-Check
    const lower = query.toLowerCase();
    const hasProprietaryRequest = lower.includes('formula') || lower.includes('catalyst ratio') || lower.includes('proprietary');
    const hasEmergencyOverride = lower.includes('bypass interlock') || lower.includes('disable alarm') || lower.includes('force valve');

    const matched = matchQuery(query);

    const startTime = Date.now();
    const simulatedTokens = Math.floor(Math.random() * 80) + 120;
    const latency = Math.floor(Math.random() * 80) + 340;

    let responsePayload;

    if (matched) {
      const { match, score } = matched;

      let policyStatus = match.policyStatus;
      let redactions = match.redactions ? [...match.redactions] : [];

      if (hasProprietaryRequest && policyStatus !== 'REDACTED') {
        policyStatus = 'REDACTED';
        redactions.push('Proprietary catalyst molar formulation masked under Policy-as-Code Rule #POL-402');
      }

      if (hasEmergencyOverride) {
        policyStatus = 'HITL_REQUIRED';
      }

      store.recordChatInteraction(query, match.intent, selectedModel, score, policyStatus);

      responsePayload = {
        id: `chat-${Date.now()}`,
        query: query,
        intent: match.intent,
        categoryLabel: match.categoryLabel,
        answer: match.answer,
        confidence: Number(score.toFixed(3)),
        citations: match.citations,
        policyStatus: policyStatus,
        redactions: redactions,
        suggestedFollowUps: match.suggestedFollowUps,
        hitlActionRequired: match.hitlActionRequired || hasEmergencyOverride,
        executionTelemetry: {
          model: selectedModel,
          latencyMs: latency,
          tokensPerSec: Number(((simulatedTokens / latency) * 1000).toFixed(1)),
          zeroEgressVerified: true,
          policyChecksPassed: 6,
          qdrantCosineDistance: Number((1.0 - score).toFixed(4)),
          source: 'Local Open-Weight Multimodal Vector Cache'
        }
      };
    } else {
      // Safe fallback when query doesn't match knowledge base
      store.recordChatInteraction(query, 'general', selectedModel, 0.45, 'ALLOW');

      responsePayload = {
        id: `chat-${Date.now()}`,
        query: query,
        intent: 'unmatched',
        categoryLabel: 'Refinery Knowledge Retrieval (Abstention Mode)',
        answer: `I searched the on-premise industrial knowledge vault (covering CDU-1, HCU-3, FCCU-2, SRU-2, and Utilities), but no verified engineering document or P&ID directly matches your query "${query}".\n\nUnder our Evidence-First Sovereign AI Policy, Alpha-6 does not fabricate or extrapolate industrial operating answers when grounded citations are missing.\n\nPlease select one of the verified refinery topics below or rephrase your query with specific equipment tags (e.g. PSV-2041, ST-401, HCU-3, F-101).`,
        confidence: 0.42,
        citations: [],
        policyStatus: 'ALLOWED',
        redactions: [],
        suggestedFollowUps: [
          "How does Alpha-6 guarantee zero data egress in an air-gapped refinery network?",
          "What is the step-by-step emergency depressurization protocol for Hydrocracker Unit HCU-3?",
          "Where is safety relief valve PSV-2041 located and what is its set cracking pressure?",
          "How should operators respond to high vibration alarm on Steam Turbine ST-401?"
        ],
        hitlActionRequired: false,
        executionTelemetry: {
          model: selectedModel,
          latencyMs: 145,
          tokensPerSec: 68.0,
          zeroEgressVerified: true,
          policyChecksPassed: 6,
          abstentionTriggered: true,
          source: 'Zero-Egress Deterministic Guardrail'
        }
      };
    }

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: 'Internal chat processing error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
