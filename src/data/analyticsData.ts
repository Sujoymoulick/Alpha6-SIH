export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operator: string;
  role: string;
  unit: string;
  action: string;
  model: string;
  policyVerdict: 'ALLOW' | 'REDACTED' | 'FLAG_FOR_HITL' | 'DENIED';
  confidence: number;
  latencyMs: number;
  hash: string;
}

export interface AnalyticsSummary {
  groundedAnswerRate: number;
  citationCoverage: number;
  totalIndexedDocuments: number;
  totalVectorChunks: number;
  airGappedIntegrityPercent: number;
  dataEgressBytes: number;
  averageLatencyMs: number;
  totalQueriesProcessed: number;
  policyInterceptionsCount: number;
  hitlPendingCount: number;
  hitlApprovedCount: number;
  gpuStats: {
    device: string;
    temperatureCelsius: number;
    vramUsedGb: number;
    vramTotalGb: number;
    utilizationPercent: number;
    throughputTokensSec: number;
  }[];
  queriesByCategory: {
    category: string;
    count: number;
    percentage: number;
  }[];
  queriesByUnit: {
    unit: string;
    count: number;
    percentage: number;
  }[];
  auditLogs: AuditLogEntry[];
}

export const INITIAL_ANALYTICS: AnalyticsSummary = {
  groundedAnswerRate: 98.4,
  citationCoverage: 99.1,
  totalIndexedDocuments: 1482,
  totalVectorChunks: 14820,
  airGappedIntegrityPercent: 100.0,
  dataEgressBytes: 0,
  averageLatencyMs: 412,
  totalQueriesProcessed: 3240,
  policyInterceptionsCount: 42,
  hitlPendingCount: 2,
  hitlApprovedCount: 19,
  gpuStats: [
    {
      device: "GPU 0: NVIDIA RTX 6000 Ada (48GB)",
      temperatureCelsius: 58,
      vramUsedGb: 19.4,
      vramTotalGb: 48.0,
      utilizationPercent: 44,
      throughputTokensSec: 84.2
    },
    {
      device: "GPU 1: NVIDIA RTX 6000 Ada (48GB)",
      temperatureCelsius: 52,
      vramUsedGb: 14.8,
      vramTotalGb: 48.0,
      utilizationPercent: 31,
      throughputTokensSec: 72.8
    }
  ],
  queriesByCategory: [
    { category: "Standard Operating Procedures (SOP)", count: 1240, percentage: 38.3 },
    { category: "P&ID & Blueprint Diagnostics", count: 864, percentage: 26.7 },
    { category: "Alarm & Emergency Response", count: 528, percentage: 16.3 },
    { category: "Predictive Maintenance", count: 374, percentage: 11.5 },
    { category: "HSE & Chemical Safety (MSDS)", count: 234, percentage: 7.2 }
  ],
  queriesByUnit: [
    { unit: "CDU-1 (Crude Distillation)", count: 1140, percentage: 35.2 },
    { unit: "HCU-3 (Hydrocracker Unit)", count: 890, percentage: 27.5 },
    { unit: "FCCU-2 (Catalytic Cracker)", count: 580, percentage: 17.9 },
    { unit: "Utilities & Steam Turbines", count: 390, percentage: 12.0 },
    { unit: "SRU-2 (Sulfur Recovery)", count: 240, percentage: 7.4 }
  ],
  auditLogs: [
    {
      id: "log-1092",
      timestamp: "2026-09-29 23:14:02",
      operator: "K. Raman",
      role: "Lead Process Engineer",
      unit: "HCU-3",
      action: "SOP-HCU-EP-018 Depressurization verification executed",
      model: "Llama-3-8B-Industrial",
      policyVerdict: "ALLOW",
      confidence: 0.994,
      latencyMs: 385,
      hash: "a94f83c178be"
    },
    {
      id: "log-1091",
      timestamp: "2026-09-29 23:10:05",
      operator: "R. Patel",
      role: "Maintenance Supervisor",
      unit: "Utilities",
      action: "Work Order WO-88401 created for Pump P-102B seal replacement",
      model: "Llama-3-8B-Industrial",
      policyVerdict: "FLAG_FOR_HITL",
      confidence: 0.942,
      latencyMs: 375,
      hash: "912bfa408104"
    },
    {
      id: "log-1090",
      timestamp: "2026-09-29 22:58:19",
      operator: "V. Sharma",
      role: "Shift DCS Operator",
      unit: "Utilities",
      action: "Steam Turbine ST-401 Governor valve throttle proposal (15%)",
      model: "Llama-3-8B-Industrial",
      policyVerdict: "FLAG_FOR_HITL",
      confidence: 0.965,
      latencyMs: 412,
      hash: "f4901bca2801"
    },
    {
      id: "log-1089",
      timestamp: "2026-09-29 22:15:40",
      operator: "S. Moulick",
      role: "AI Systems Architect",
      unit: "CDU-1",
      action: "P&ID DWG-CDU-401 ISA-5.1 symbol and tag extraction complete",
      model: "Qwen-2.5-VL-7B",
      policyVerdict: "ALLOW",
      confidence: 0.982,
      latencyMs: 640,
      hash: "c38d991b5003"
    },
    {
      id: "log-1088",
      timestamp: "2026-09-29 21:30:12",
      operator: "A. Sengupta",
      role: "Chief Safety Auditor",
      unit: "FCCU-2",
      action: "Catalyst formula auto-redacted in FCCU post-incident review",
      model: "Mistral-7B-Plant",
      policyVerdict: "REDACTED",
      confidence: 0.978,
      latencyMs: 490,
      hash: "d83017fa4219"
    }
  ]
};
