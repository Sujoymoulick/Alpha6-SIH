import { INITIAL_RECORDS, type PlantRecord } from './sampleRecords';
import { INITIAL_ANALYTICS, type AnalyticsSummary, type AuditLogEntry } from './analyticsData';

// In-memory persistent state across requests during localhost server lifetime
let records: PlantRecord[] = JSON.parse(JSON.stringify(INITIAL_RECORDS));
let analytics: AnalyticsSummary = JSON.parse(JSON.stringify(INITIAL_ANALYTICS));

let activeSettings = {
  activeModel: 'Llama-3-8B-Industrial (vLLM)',
  airGappedMode: 'STRICT_AIR_GAP', // 'STRICT_AIR_GAP' | 'MONITORED_LAN'
  policySensitivity: 'STRICT_MILITARY', // 'STRICT_MILITARY' | 'STANDARD_INDUSTRIAL' | 'AUDIT_ONLY'
  activeOperator: 'K. Raman (Lead Process Eng)',
  operatorRole: 'Senior Operations Engineer'
};

export const store = {
  getRecords: (filter?: { search?: string; unit?: string; category?: string; status?: string }) => {
    let result = [...records];
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.recordNumber.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        (r.details.equipmentTag && r.details.equipmentTag.toLowerCase().includes(q))
      );
    }
    if (filter?.unit && filter.unit !== 'ALL') {
      result = result.filter(r => r.plantUnit === filter.unit);
    }
    if (filter?.category && filter.category !== 'ALL') {
      result = result.filter(r => r.category === filter.category);
    }
    if (filter?.status && filter.status !== 'ALL') {
      result = result.filter(r => r.status === filter.status);
    }
    return result;
  },

  getRecordById: (id: string) => {
    return records.find(r => r.id === id || r.recordNumber === id);
  },

  approveHitlAction: (id: string, approverName: string) => {
    const record = records.find(r => r.id === id || r.recordNumber === id);
    if (!record) return null;

    record.status = 'Verified';
    record.scenarioType = 'successful';
    record.details.policyVerdict = 'ALLOW';
    record.details.technicalNotes = `[HITL APPROVED by ${approverName} at ${new Date().toISOString()}]: Action authorized and dispatched to DCS interlock controller.`;
    record.lastUpdated = new Date().toISOString().replace('T', ' ').substring(0, 19);

    analytics.hitlApprovedCount += 1;
    analytics.hitlPendingCount = Math.max(0, analytics.hitlPendingCount - 1);

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: record.lastUpdated,
      operator: approverName,
      role: 'Supervisory Engineer',
      unit: record.plantUnit,
      action: `[HITL SIGN-OFF] Authorized action for ${record.recordNumber}: ${record.details.hitlActionDescription || record.title}`,
      model: record.details.modelUsed,
      policyVerdict: 'ALLOW',
      confidence: record.confidenceScore,
      latencyMs: 120,
      hash: `sig-${Math.random().toString(36).substring(2, 12)}`
    };
    analytics.auditLogs.unshift(newLog);

    return record;
  },

  rejectHitlAction: (id: string, reason: string, rejectorName: string) => {
    const record = records.find(r => r.id === id || r.recordNumber === id);
    if (!record) return null;

    record.status = 'Invalid Input';
    record.scenarioType = 'invalid_input';
    record.details.policyVerdict = 'DENIED';
    record.details.technicalNotes = `[HITL REJECTED by ${rejectorName}]: Reason: ${reason}. Action canceled and quarantined.`;
    record.lastUpdated = new Date().toISOString().replace('T', ' ').substring(0, 19);

    analytics.hitlPendingCount = Math.max(0, analytics.hitlPendingCount - 1);

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: record.lastUpdated,
      operator: rejectorName,
      role: 'Supervisory Engineer',
      unit: record.plantUnit,
      action: `[HITL REJECTED] Canceled action for ${record.recordNumber}. Reason: ${reason}`,
      model: record.details.modelUsed,
      policyVerdict: 'DENIED',
      confidence: record.confidenceScore,
      latencyMs: 95,
      hash: `rej-${Math.random().toString(36).substring(2, 12)}`
    };
    analytics.auditLogs.unshift(newLog);

    return record;
  },

  getAnalytics: () => {
    // Recount pending
    analytics.hitlPendingCount = records.filter(r => r.status === 'Pending Approval').length;
    return { ...analytics };
  },

  recordChatInteraction: (query: string, intent: string, model: string, confidence: number, policyVerdict: 'ALLOW' | 'REDACTED' | 'FLAG_FOR_HITL' | 'DENIED' = 'ALLOW') => {
    analytics.totalQueriesProcessed += 1;
    if (policyVerdict === 'REDACTED') {
      analytics.policyInterceptionsCount += 1;
    }
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      operator: activeSettings.activeOperator,
      role: activeSettings.operatorRole,
      unit: 'Operations Console',
      action: `Query evaluated: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`,
      model: model,
      policyVerdict: policyVerdict,
      confidence: confidence,
      latencyMs: Math.floor(Math.random() * 120) + 340,
      hash: `chk-${Math.random().toString(36).substring(2, 10)}`
    };
    analytics.auditLogs.unshift(newLog);
    if (analytics.auditLogs.length > 50) {
      analytics.auditLogs.pop();
    }
  },

  getSettings: () => ({ ...activeSettings }),

  updateSettings: (newSettings: Partial<typeof activeSettings>) => {
    activeSettings = { ...activeSettings, ...newSettings };
    return { ...activeSettings };
  },

  resetToDefaults: () => {
    records = JSON.parse(JSON.stringify(INITIAL_RECORDS));
    analytics = JSON.parse(JSON.stringify(INITIAL_ANALYTICS));
    activeSettings = {
      activeModel: 'Llama-3-8B-Industrial (vLLM)',
      airGappedMode: 'STRICT_AIR_GAP',
      policySensitivity: 'STRICT_MILITARY',
      activeOperator: 'K. Raman (Lead Process Eng)',
      operatorRole: 'Senior Operations Engineer'
    };
    return { success: true, message: 'All demo records, analytics telemetry, and settings have been reset to initial seed state.' };
  }
};
