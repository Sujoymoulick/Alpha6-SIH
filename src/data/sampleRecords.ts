export interface PlantRecord {
  id: string;
  recordNumber: string;
  title: string;
  category: 'SOP' | 'P&ID' | 'Telemetry / Alarm' | 'Incident' | 'HSE Safety' | 'Maintenance';
  plantUnit: 'CDU-1' | 'HCU-3' | 'FCCU-2' | 'SRU-2' | 'Utilities' | 'Tank Farm';
  status: 'Completed' | 'Pending Approval' | 'Verified' | 'Invalid Input' | 'No Result';
  scenarioType: 'successful' | 'pending' | 'completed' | 'invalid_input' | 'no_result';
  confidenceScore: number;
  lastUpdated: string;
  operator: string;
  summary: string;
  details: {
    equipmentTag?: string;
    criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    policyVerdict: 'ALLOW' | 'DENY' | 'REDACT' | 'FLAG_FOR_HITL';
    hitlActionRequired?: boolean;
    hitlActionDescription?: string;
    hitlImpactAssessment?: string;
    retrievedChunksCount: number;
    modelUsed: string;
    latencyMs: number;
    auditHash: string;
    redactedFields?: string[];
    technicalNotes: string;
    citations: {
      document: string;
      section: string;
      page: number;
    }[];
  };
  simulatedDataNotice: string;
}

export const INITIAL_RECORDS: PlantRecord[] = [
  {
    id: "rec-001",
    recordNumber: "REC-2026-HCU-001",
    title: "Hydrocracker Emergency Depressurization SOP Verification",
    category: "SOP",
    plantUnit: "HCU-3",
    status: "Verified",
    scenarioType: "successful",
    confidenceScore: 0.994,
    lastUpdated: "2026-09-29 21:45:10",
    operator: "K. Raman (Lead Process Eng)",
    summary: "Validated emergency depressurization sequence under SOP-HCU-EP-018. Dual blowdown valves BDV-301A/B confirmed operational with quench hydrogen cooling protocol.",
    details: {
      equipmentTag: "BDV-301A / BDV-301B / HV-312",
      criticality: "CRITICAL",
      policyVerdict: "ALLOW",
      retrievedChunksCount: 6,
      modelUsed: "Llama-3-8B-Industrial (vLLM)",
      latencyMs: 385,
      auditHash: "sha256-a94f83c178be09d421ebca1208945f3",
      technicalNotes: "Depressurization rate bounded at 21 barg/min to prevent reactor shell embrittlement. All interlock logic verified against DCS matrix.",
      citations: [
        { document: "SOP-HCU-EP-018", section: "§5.1 Depressurization Sequence", page: 31 },
        { document: "HAZOP-HCU-03", section: "Node 4: Reactor Circuit", page: 87 }
      ]
    },
    simulatedDataNotice: "SIMULATED INDUSTRIAL RECORD — Alpha-6 SIH2026 Benchmark Dataset"
  },
  {
    id: "rec-002",
    recordNumber: "REC-2026-CDU-002",
    title: "P&ID Vector Analysis: Crude Distillation Fractionator C-401",
    category: "P&ID",
    plantUnit: "CDU-1",
    status: "Completed",
    scenarioType: "completed",
    confidenceScore: 0.982,
    lastUpdated: "2026-09-29 20:12:44",
    operator: "S. Moulick (Systems Architect)",
    summary: "Multimodal extraction of Drawing DWG-CDU-401 Sheet 2. Identified 18 control valves, 6 safety instruments, and tagged relief valve PSV-2041 set at 4.80 barg.",
    details: {
      equipmentTag: "C-401 / PSV-2041 / FCV-4012",
      criticality: "HIGH",
      policyVerdict: "ALLOW",
      retrievedChunksCount: 8,
      modelUsed: "Qwen-2.5-VL-7B (Local VLM)",
      latencyMs: 640,
      auditHash: "sha256-c38d991b5003ea125f448bca61209e7",
      technicalNotes: "ISA-5.1 instrument bubbles cataloged into Qdrant spatial index. Traced tie-in lines 24\"-VAP-4011-CS and discharge header 36\"-FL-4001.",
      citations: [
        { document: "DWG-CDU-401", section: "Sheet 2 of 4 (Grid D-7)", page: 2 },
        { document: "MDS-PSV-2041", section: "Process Conditions & Sizing", page: 2 }
      ]
    },
    simulatedDataNotice: "SIMULATED INDUSTRIAL RECORD — Alpha-6 SIH2026 Benchmark Dataset"
  },
  {
    id: "rec-003",
    recordNumber: "REC-2026-TURB-003",
    title: "Steam Turbine ST-401 High Vibration Exceedance Incident",
    category: "Telemetry / Alarm",
    plantUnit: "Utilities",
    status: "Pending Approval",
    scenarioType: "pending",
    confidenceScore: 0.965,
    lastUpdated: "2026-09-29 22:58:19",
    operator: "V. Sharma (Shift DCS Operator)",
    summary: "Drive End Bearing vibration hit 7.6 mm/s (HH Alarm > 7.2 mm/s). Workbench calculated mitigation plan requiring immediate Human-In-The-Loop approval.",
    details: {
      equipmentTag: "ST-401 / VT-401A / MSV-401",
      criticality: "CRITICAL",
      policyVerdict: "FLAG_FOR_HITL",
      hitlActionRequired: true,
      hitlActionDescription: "Throttle Main Steam Governor Valve MSV-401 by 15% and switch lube oil filter duplex valve to Bank B to mitigate bearing oil whip.",
      hitlImpactAssessment: "Reduces turbine output by 1.8 MW for 15 minutes. Prevents trip of main cooling water circulation pumps. Zero hazard to personnel.",
      retrievedChunksCount: 5,
      modelUsed: "Llama-3-8B-Industrial (vLLM)",
      latencyMs: 412,
      auditHash: "sha256-f4901bca2801458e09f582dae448101",
      technicalNotes: "Awaiting digital sign-off from Chief Mechanical Engineer before setpoint command is dispatched to Honeywell DCS bridge.",
      citations: [
        { document: "MNT-TURB-401", section: "§8.4 Vibration Anomalies", page: 64 },
        { document: "ALM-RESP-03", section: "Tag VT-401 Alarm Matrix", page: 5 }
      ]
    },
    simulatedDataNotice: "SIMULATED INDUSTRIAL RECORD — Alpha-6 SIH2026 Benchmark Dataset"
  },
  {
    id: "rec-004",
    recordNumber: "REC-2026-FCCU-004",
    title: "FCCU Regenerator Thermal Runaway Post-Incident Audit",
    category: "Incident",
    plantUnit: "FCCU-2",
    status: "Completed",
    scenarioType: "completed",
    confidenceScore: 0.978,
    lastUpdated: "2026-09-28 17:30:00",
    operator: "A. Sengupta (Chief Safety Auditor)",
    summary: "Post-event reconstruction of regenerator thermal spike (>732°C). Feed reduction protocol SOP-FCCU-OPS-031 verified. Confidential catalyst ratio masked.",
    details: {
      equipmentTag: "R-201 / FCV-201 / PCV-220",
      criticality: "HIGH",
      policyVerdict: "REDACT",
      redactedFields: ["Catalyst composition ratio: Pt-Re/Al2O3 0.28wt%", "Vendor license identifier"],
      retrievedChunksCount: 7,
      modelUsed: "Mistral-7B-Plant (Ollama)",
      latencyMs: 490,
      auditHash: "sha256-d83017fa4219c01823fe45b81048b29",
      technicalNotes: "Policy Gate intercepted proprietary catalyst formulation before model ingestion. Stabilized bed temperature logged at 695°C without damage.",
      citations: [
        { document: "SOP-FCCU-OPS-031", section: "§9.2 Regenerator Thermal Runaway", page: 53 },
        { document: "POL-DATA-CLASS", section: "§4.2 Proprietary Formulations", page: 8 }
      ]
    },
    simulatedDataNotice: "SIMULATED INDUSTRIAL RECORD — Alpha-6 SIH2026 Benchmark Dataset"
  },
  {
    id: "rec-005",
    recordNumber: "REC-2026-HSE-005",
    title: "Hazardous Chemical Safety Data: Hydrogen Sulfide & Benzene",
    category: "HSE Safety",
    plantUnit: "SRU-2",
    status: "Verified",
    scenarioType: "successful",
    confidenceScore: 0.998,
    lastUpdated: "2026-09-29 19:04:12",
    operator: "N. Deshmukh (HSE Officer)",
    summary: "Mandatory PPE and exposure threshold verification for Claus sulfur recovery plant. OSHA PEL 20 ppm, IDLH 100 ppm, continuous multi-gas sensor required.",
    details: {
      equipmentTag: "SRU-CLAUS-02 / GD-501A/B",
      criticality: "CRITICAL",
      policyVerdict: "ALLOW",
      retrievedChunksCount: 4,
      modelUsed: "Llama-3-8B-Industrial (vLLM)",
      latencyMs: 310,
      auditHash: "sha256-e71029cba83141f17304bfa3829011a",
      technicalNotes: "Zero permissible threshold for unequipped entry. Positive pressure SCBA strictly enforced for all battery limit permits.",
      citations: [
        { document: "MSDS-H2S-2025", section: "§8 Exposure Controls & Personal Protection", page: 4 },
        { document: "HSE-SRU-SOP", section: "§3.2 SCBA Protocols", page: 16 }
      ]
    },
    simulatedDataNotice: "SIMULATED INDUSTRIAL RECORD — Alpha-6 SIH2026 Benchmark Dataset"
  },
  {
    id: "rec-006",
    recordNumber: "REC-2026-MNT-006",
    title: "Cooling Water Pump P-102B Mechanical Seal Failure Review",
    category: "Maintenance",
    plantUnit: "Utilities",
    status: "Pending Approval",
    scenarioType: "pending",
    confidenceScore: 0.942,
    lastUpdated: "2026-09-29 23:10:05",
    operator: "R. Patel (Maintenance Supervisor)",
    summary: "Primary seal barrier fluid pressure dropped from 6.0 barg to 1.8 barg. Agent generated work order and automated lockout tagout (LOTO) isolation sequence.",
    details: {
      equipmentTag: "P-102B / MOV-102B / MOV-104B",
      criticality: "MEDIUM",
      policyVerdict: "FLAG_FOR_HITL",
      hitlActionRequired: true,
      hitlActionDescription: "Approve SAP Maintenance Work Order #WO-88401 and authorize LOTO electrical isolation permit for Pump P-102B 75kW motor.",
      hitlImpactAssessment: "Standby pump remains available; main cooling header pressure sustained by P-102A. Zero plant interruption.",
      retrievedChunksCount: 4,
      modelUsed: "Llama-3-8B-Industrial (vLLM)",
      latencyMs: 375,
      auditHash: "sha256-912bfa4081045da174823901bca8371",
      technicalNotes: "Seal Flush Plan 53A barrier fluid vessel bladder integrity suspected failed. Requires immediate physical workshop replacement.",
      citations: [
        { document: "SOP-CW-022", section: "§6.1 Pump Changeover Procedure", page: 14 },
        { document: "PMP-DS-102", section: "Mechanical Seal Flush Plan", page: 7 }
      ]
    },
    simulatedDataNotice: "SIMULATED INDUSTRIAL RECORD — Alpha-6 SIH2026 Benchmark Dataset"
  },
  {
    id: "rec-007",
    recordNumber: "REC-2026-ERR-007",
    title: "Corrupted SCADA Ingestion: Telemetry Packet Ingestion Error",
    category: "Telemetry / Alarm",
    plantUnit: "Tank Farm",
    status: "Invalid Input",
    scenarioType: "invalid_input",
    confidenceScore: 0.120,
    lastUpdated: "2026-09-29 18:42:01",
    operator: "Automated Telemetry Ingester",
    summary: "Ingestion rejected by Deterministic Policy Gate. Payload contained malformed JSON with non-standard float NaN at byte offset 0x4F0 and failed CRC32 checksum.",
    details: {
      equipmentTag: "LT-502A / T-502 (Corrupted Stream)",
      criticality: "LOW",
      policyVerdict: "DENY",
      retrievedChunksCount: 0,
      modelUsed: "Deterministic Validator (Pre-LLM)",
      latencyMs: 18,
      auditHash: "sha256-0000000000000000000000000000000-ERR",
      technicalNotes: "Input validation error: [E_SCADA_CRC_MISMATCH] Payload size 14,812 bytes truncated. Ingestion aborted before GPU allocation to prevent buffer overflow.",
      citations: [
        { document: "SYS-INGEST-SPEC", section: "§2.4 Data Hygiene & Validation Gates", page: 3 }
      ]
    },
    simulatedDataNotice: "SIMULATED INDUSTRIAL RECORD — Alpha-6 SIH2026 Benchmark Dataset"
  },
  {
    id: "rec-008",
    recordNumber: "REC-2026-VOID-008",
    title: "Unindexed Geothermal Loop Query: Deep Wellhead P-990 Spec",
    category: "SOP",
    plantUnit: "Utilities",
    status: "No Result",
    scenarioType: "no_result",
    confidenceScore: 0.000,
    lastUpdated: "2026-09-29 16:15:30",
    operator: "T. Narayanan (Junior Trainee)",
    summary: "Query for 'Geothermal high-enthalpy steam loop P-990'. Qdrant hybrid retrieval returned zero matching vectors within similarity threshold (>0.75). Model safely abstained.",
    details: {
      equipmentTag: "P-990 (Non-existent Asset)",
      criticality: "LOW",
      policyVerdict: "ALLOW",
      retrievedChunksCount: 0,
      modelUsed: "Evidence Verifier Engine",
      latencyMs: 65,
      auditHash: "sha256-VOID-UNINDEXED-RECORD-000",
      technicalNotes: "Refusal & Abstention Engine triggered. Rather than fabricating geothermal wellhead specifications, the workbench informed the operator of missing domain documents.",
      citations: []
    },
    simulatedDataNotice: "SIMULATED INDUSTRIAL RECORD — Alpha-6 SIH2026 Benchmark Dataset"
  }
];
