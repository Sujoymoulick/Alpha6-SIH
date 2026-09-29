export interface Citation {
  docId: string;
  title: string;
  section: string;
  page: number;
  confidence: number;
}

export interface QAPair {
  id: string;
  question: string;
  keywords: string[];
  intent: 'safety' | 'engineering' | 'operations' | 'maintenance' | 'architecture' | 'policy';
  categoryLabel: string;
  answer: string;
  citations: Citation[];
  policyStatus: 'ALLOWED' | 'REDACTED' | 'HITL_REQUIRED';
  redactions?: string[];
  suggestedFollowUps: string[];
  requiredModel?: 'Llama-3-8B-Industrial' | 'Qwen-2.5-VL-Multimodal' | 'Mistral-7B-Plant';
  hitlActionRequired?: boolean;
}

export const KNOWLEDGE_BASE: QAPair[] = [
  {
    id: "kb-pmp-204",
    question: "What is the safe startup procedure for Pump P-204?",
    keywords: [
      "pump p-204", "p-204", "p204", "safe startup", "startup procedure", "pump startup",
      "heavy crude booster", "safe startup procedure", "pump p204", "start pump p-204", "find an sop"
    ],
    intent: "operations",
    categoryLabel: "Standard Operating Procedures (SOP)",
    answer: `SAFE STARTUP PROCEDURE FOR PUMP P-204 (HEAVY CRUDE BOOSTER PUMP)

[REFERENCED SOP: SOP-PMP-204-OPS, Rev 4.2 | Page 12, §3.4 "Suction Priming & Seal Flush Verification"]

1. PRE-START ISOLATION & INTEGRITY CHECK:
   • Confirm LOTO permits cleared and field work permits closed.
   • Verify atmospheric LEL < 10% in pump pit using portable multi-gas detector.
   • Inspect lube oil sump level (sight glass 50–65%) and cooling water return flow to bearing jackets.

2. SEAL FLUSH PLAN VERIFICATION (API PLAN 53A):
   • Check Barrier Fluid Vessel (V-204) pressure: must indicate minimum 4.8 barg (1.5 bar above maximum stuffing box pressure of 3.3 barg).
   • Verify mechanical seal barrier fluid reservoir level is normal (70%).

3. SUCTION LINE-UP & PRIMING:
   • Slowly open suction isolation valve MOV-2040 100% (Car-Seal Open).
   • Vent pump casing via top vent needle valve V-204-VT into closed drain until solid liquid flow without vapor bubbling is observed.
   • Confirm suction pressure gauge PI-2041 reads >= 2.4 barg, guaranteeing NPSHa > 3.2m (NPSHr = 2.1m; margin = 1.1m).

4. MINIMUM FLOW RECIRCULATION LINE-UP:
   • Verify minimum flow bypass valve FCV-2042 is open to suction vessel to prevent deadheading.
   • Ensure main discharge throttle valve MOV-2041 is in CLOSED position prior to start.

5. MOTOR ENERGIZATION [SUPERVISORY HITL APPROVAL REQUIRED]:
   • Shift Supervisor must authorize 6.6 kV breaker closure on Switchgear Bus 2B via DCS Interlock Gate #INT-P204.
   • Depress local START button or command START from DCS Console 02.

6. DISCHARGE RAMP & PARAMETER MONITORING:
   • Monitor motor run-up current: peak 420A must decay to normal operating 112A within 6.5 seconds.
   • Once discharge pressure reaches shut-in head of 14.8 barg, slowly crack open discharge valve MOV-2041 over 90 seconds.
   • Regulate discharge flow to nominal design rate 340 m³/hr.
   • Verify drive-end bearing vibration VT-204A <= 2.4 mm/s RMS (Alarm threshold: 4.5 mm/s) and bearing metal temperature <= 68°C.

SAFETY WARNINGS:
   • WARNING [API 682]: Never operate Pump P-204 with barrier fluid pressure below 4.5 barg; catastrophic dual-seal dry run and crude leakage will occur.
   • CAUTION [Cavitation Risk]: Do not throttle suction valve MOV-2040 under any circumstances.
   • SAFETY MANDATE: Continuous H2S personal monitor required within 5 meters of pump casing.`,
    citations: [
      { docId: "SOP-PMP-204-OPS", title: "Heavy Crude Booster Pump P-204 Safe Startup & Lineup", section: "§3.4 Suction Priming & Seal Flush", page: 12, confidence: 0.994 },
      { docId: "DWG-CDU-401", title: "P&ID Drawing: Heavy Crude Transfer & Booster Circuit", section: "Sheet 3 of 4 (Grid B-4)", page: 3, confidence: 0.982 },
      { docId: "API-STD-682", title: "Pumps - Shaft Sealing Systems for Centrifugal and Rotary Pumps", section: "Plan 53A Barrier Pressurization", page: 44, confidence: 0.965 }
    ],
    policyStatus: "ALLOWED",
    hitlActionRequired: true,
    suggestedFollowUps: [
      "What is the procedure if barrier fluid pressure falls below 4.5 barg?",
      "Inspect P&ID Drawing DWG-CDU-401 Sheet 3 for Pump P-204",
      "Check pending HITL approvals for DCS 6.6kV breaker closure"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-001",
    question: "How does Alpha-6 guarantee zero data egress in an air-gapped refinery network?",
    keywords: ["egress", "air-gapped", "zero egress", "security", "network", "confidential", "sovereign", "data leak"],
    intent: "architecture",
    categoryLabel: "Sovereign Architecture",
    answer: "Alpha-6 operates inside a strictly isolated, on-premise industrial network boundary (Purdue Model Level 3/3.5 Industrial DMZ). All multimodal model inferences run on local GPU nodes via vLLM and Ollama using open-weight checkpoints (Llama 3, Qwen 2.5-VL, Mistral). No external DNS resolution, telemetry beacons, or cloud API calls exist in the runtime image. The workbench includes an eBPF-enforced kernel egress filter that drops any outbound packet attempting to traverse public IP ranges, verified by our live 0.00 KB egress telemetry monitor.",
    citations: [
      { docId: "SEC-ARCH-2026", title: "MRPL Sovereign AI Architecture Whitepaper", section: "§3.2 Zero-Egress Boundary", page: 14, confidence: 0.99 },
      { docId: "POL-NET-01", title: "Industrial DMZ Network Isolation Standard", section: "§7.1 Firewall Rules", page: 6, confidence: 0.97 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "Which open-weight models are currently hosted locally?",
      "How are model updates deployed without internet access?",
      "What audit telemetry is captured during operator queries?"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-002",
    question: "Which open-weight models are supported and how are they hosted locally without cloud APIs?",
    keywords: ["models", "open-weight", "vllm", "ollama", "llm", "hosting", "local", "llama", "mistral", "qwen"],
    intent: "architecture",
    categoryLabel: "Model Gateway",
    answer: "The workbench uses a model-agnostic local serving gateway compatible with vLLM (high-throughput batching with PagedAttention) and Ollama. Primary production open-weight models include: (1) Llama-3-8B-Instruct fine-tuned on refinery engineering manuals, (2) Qwen-2.5-VL-7B for multimodal P&ID blueprint analysis, and (3) Mistral-7B-Instruct for structured telemetry extraction. Models run on local NVIDIA RTX 6000 Ada / A100 PCIe accelerator cards using 4-bit/8-bit AWQ quantization to achieve <450ms time-to-first-token entirely offline.",
    citations: [
      { docId: "ENG-ML-04", title: "Local Inference Gateway Benchmark Report", section: "§2.4 Hardware Utilization", page: 9, confidence: 0.98 },
      { docId: "SPEC-MDL-01", title: "Approved Open-Weight Model Registry", section: "§1.1 Model Manifests", page: 3, confidence: 0.96 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "How does the workbench parse and reason over P&IDs?",
      "What is the system latency and token throughput?",
      "Can we switch models during a running session?"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-003",
    question: "How does the workbench parse and reason over Piping & Instrumentation Diagrams (P&IDs)?",
    keywords: ["p&id", "pid", "drawing", "blueprint", "multimodal", "diagram", "symbols", "valves", "vision"],
    intent: "engineering",
    categoryLabel: "Multimodal Vision",
    answer: "Multimodal P&ID reasoning combines OpenCV symbol detection, PyMuPDF vector extraction, and local vision-language model Qwen-2.5-VL. When an engineer submits a scanned or PDF P&ID, the pipeline: (1) vectorizes line geometries to trace piping loops, (2) isolates instrument bubbles conforming to ISA-5.1 standards (e.g., FT for Flow Transmitter, XV for Emergency Shutoff Valve), (3) associates line numbers, flow directions, and tie-in points, and (4) anchors textual tag metadata into the local Qdrant spatial vector index for contextual cross-referencing.",
    citations: [
      { docId: "SOP-PID-009", title: "Automated P&ID Vectorization & Tag Cataloging Guideline", section: "§4.3 ISA-5.1 Parsing", page: 22, confidence: 0.98 },
      { docId: "DWG-CDU-401", title: "P&ID Drawing: Crude Fractionator Tower Overhead C-401", section: "Sheet 2 of 4", page: 2, confidence: 0.95 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "Show P&ID details for Crude Distillation Fractionator C-401",
      "Where is safety relief valve PSV-2041 located?",
      "What is the procedure for emergency depressurization?"
    ],
    requiredModel: "Qwen-2.5-VL-Multimodal"
  },
  {
    id: "kb-004",
    question: "What is the step-by-step emergency depressurization protocol for Hydrocracker Unit HCU-3?",
    keywords: ["depressurization", "emergency", "hcu", "hydrocracker", "sop", "blowdown", "reactor", "pressure"],
    intent: "operations",
    categoryLabel: "Standard Operating Procedures",
    answer: "Under SOP-HCU-EP-018, Emergency Depressurization (EDP) is initiated upon reactor runaway temperature (>445°C) or primary hydrogen feed isolation. Immediate steps: (1) Activate Dual Depressurizing Valves BDV-301A and BDV-301B simultaneously from DCS Console 03. (2) Confirm quench hydrogen control valves HV-312 through HV-316 open to 100% maximum cooling flow. (3) Depressurize high-pressure loop from 145 barg to 25 barg at a controlled rate of 21 barg/min to prevent reactor metallurgical stress. (4) Trip furnace F-301 burners and inject emergency snuffing steam. (5) Divert effluent gas to High Pressure Flare System HP-FL-02.",
    citations: [
      { docId: "SOP-HCU-EP-018", title: "Hydrocracker Emergency Depressurization Standard", section: "§5.1 Depressurization Sequence", page: 31, confidence: 0.99 },
      { docId: "HAZOP-HCU-03", title: "Process Hazard Analysis: High Pressure Loop", section: "Node 4: Reactor Circuit", page: 87, confidence: 0.94 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "What triggers automated Emergency Shutdown ESD-101?",
      "What is the PPE requirement for H2S in Hydrocracker unit?",
      "View HCU Emergency Depressurization sample record"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-005",
    question: "What triggers automated Emergency Shutdown ESD-101 on Crude Distillation Unit CDU-1?",
    keywords: ["esd", "esd-101", "shutdown", "cdu", "crude", "trip", "interlock", "safety", "sis"],
    intent: "safety",
    categoryLabel: "Safety Instrumented Systems",
    answer: "Automated ESD-101 (Safety Integrity Level SIL-3) trips upon any of four voting logic conditions: (1) Atmospheric Furnace F-101 tube skin temperature >680°C (2-out-of-3 voting on TE-1042/43/44). (2) Column C-101 bottom sump level >92% (preventing hydrocarbon carryover into vacuum column). (3) Fuel gas pressure downstream of PCV-1012 falling below 0.35 barg (flame-out hazard). (4) Actuation of field emergency pushbuttons PB-CDU-01 through 04. Execution immediately trips fuel gas safety shutoff valve XV-1001, opens quench steam, and isolates crude charge pumps P-101A/B.",
    citations: [
      { docId: "SIS-CDU-ESD101", title: "Safety Instrumented Functions: CDU-1 Interlock Matrix", section: "Table 4.1 Trip Logics", page: 12, confidence: 0.99 },
      { docId: "IEC-61511-MRPL", title: "Functional Safety Assessment: SIL-3 Loops", section: "§8.3 Voting Architectures", page: 45, confidence: 0.95 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "What is the procedure for restarting CDU-1 after an ESD trip?",
      "How to respond to furnace F-101 flame-out?",
      "Explain the policy gate check on ESD manual bypass"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-006",
    question: "When is human approval strictly enforced before executing an agentic action?",
    keywords: ["hitl", "human in the loop", "approval", "sensitive", "action", "agentic", "sandbox", "policy gate"],
    intent: "policy",
    categoryLabel: "Policy & Human-In-The-Loop",
    answer: "Alpha-6 enforces zero autonomous control execution on physical equipment. All AI agent outputs are partitioned into two tiers: (1) Advisory / Read-Only (retrieval, drawing explanation, calculation checks) which complete automatically; and (2) Operational Impact Actions (setpoint change proposals, valve actuation requests, alarm threshold modifications, maintenance work order creation) which are suspended at the Human-in-the-Loop (HITL) gate. A certified shift supervisor or lead engineer must inspect the proposed command, view simulated safety impact, and provide cryptographic authorization before release.",
    citations: [
      { docId: "POL-HITL-2026", title: "MRPL Governance: Human-in-the-Loop Operational Mandate", section: "§2.1 Tiered Action Classes", page: 4, confidence: 0.99 },
      { docId: "IEC-62443-AI", title: "Industrial Cyber Security for Autonomous Workbenches", section: "§6.4 Supervisory Control", page: 19, confidence: 0.96 }
    ],
    policyStatus: "HITL_REQUIRED",
    hitlActionRequired: true,
    suggestedFollowUps: [
      "Review pending HITL approval queue",
      "How does the policy gate redact confidential formulas?",
      "View sample pending turbine vibration record"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-007",
    question: "How are proprietary chemical formulas and PII redacted before prompting the local LLM?",
    keywords: ["redaction", "pii", "proprietary", "formula", "catalyst", "policy gate", "data classification"],
    intent: "policy",
    categoryLabel: "Policy Gate & Compliance",
    answer: "Every prompt and retrieved document chunk traverses a deterministic Policy-as-Code filter before reaching the local model context. The filter matches high-confidentiality patterns using compiled regex and named-entity recognition: (1) Proprietary catalyst formulation percentages (e.g. Zeolite Y / Platinum ratios are masked as [REDACTED_PROPRIETARY_CATALYST_FORMULA]), (2) Operator personal identifiers (Aadhaar, employee IDs, personal phone numbers are masked as [REDACTED_PII]), and (3) Commercial crude blend assay pricing tables. Redacted artifacts maintain an audit hash for verifiable compliance.",
    citations: [
      { docId: "POL-DATA-CLASS", title: "Corporate Data Classification & Redaction Directive", section: "§4.2 Proprietary Formulations", page: 8, confidence: 0.97 },
      { docId: "SYS-AUDIT-SPEC", title: "Policy-as-Code Implementation Specification", section: "§3.1 Redaction Transformers", page: 11, confidence: 0.95 }
    ],
    policyStatus: "REDACTED",
    redactions: ["Catalyst composition ratio: Pt-Re/Al2O3 0.28wt%", "Operator Aadhaar/Employee ID: EMP-948102"],
    suggestedFollowUps: [
      "What is the difference between Strict and Standard policy mode?",
      "How does Alpha-6 guarantee zero data egress?",
      "Test a query with proprietary chemical names"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-008",
    question: "How does the evidence-first RAG architecture prevent hallucinations in plant procedures?",
    keywords: ["hallucination", "rag", "evidence", "citation", "grounded", "qdrant", "verification", "abstain"],
    intent: "architecture",
    categoryLabel: "Evidence-First RAG",
    answer: "Alpha-6 employs an Evidence-First RAG protocol: (1) Hybrid dense semantic retrieval (Qdrant) combined with BM25 sparse keyword matching over tokenized industrial documents. (2) Strict context-grounding: the local model is instruction-tuned to synthesize answers strictly from retrieved chunks, citing the exact document ID, section number, and page number. (3) Post-generation deterministic verifier: an automated checker validates every statement against retrieved embeddings. If the citation confidence score falls below 85% or chunks contradict, the workbench explicitly abstains and flags the query for senior engineering review.",
    citations: [
      { docId: "RES-RAG-01", title: "Factuality & Citation Grounding in Industrial Operations", section: "§4.1 Abstention Mechanics", page: 18, confidence: 0.99 },
      { docId: "SYS-VERIF-02", title: "Deterministic Output Verifier Engine", section: "§2.2 Confidence Calculation", page: 7, confidence: 0.96 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "What is the current Grounded Answer Rate in analytics?",
      "Show sample records with verified citations",
      "How does the model handle an unindexed document query?"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-009",
    question: "How should operators respond to high vibration alarm (HH > 7.2 mm/s) on Steam Turbine ST-401?",
    keywords: ["vibration", "turbine", "st-401", "alarm", "bearing", "maintenance", "trip", "steam", "explain an alarm", "explain alarm", "turbine st-401"],
    intent: "maintenance",
    categoryLabel: "Predictive Maintenance",
    answer: "Per Maintenance Guideline MNT-TURB-401, vibration exceeding HH threshold (7.2 mm/s RMS on Drive End Bearing #1) requires immediate intervention: (1) Verify alarm validity across redundant probe VT-401B to rule out accelerometer failure. (2) Immediately reduce turbine load by throttling high-pressure steam governor valve MSV-401 by 15% and monitor vibration trend for 90 seconds. (3) Inspect lube oil supply header pressure (must be >= 2.1 barg) and bearing temperature (must not exceed 95°C). (4) If vibration remains > 7.2 mm/s for > 120 seconds or climbs past 9.0 mm/s, initiate manual trip via DCS PB-ST-TRIP and engage electric barring gear once rotor stops.",
    citations: [
      { docId: "MNT-TURB-401", title: "Steam Turbine ST-401 Operation & Maintenance Manual", section: "§8.4 Vibration Anomalies", page: 64, confidence: 0.98 },
      { docId: "ALM-RESP-03", title: "Critical Rotating Machinery Alarm Response Sheet", section: "Tag VT-401", page: 5, confidence: 0.94 }
    ],
    policyStatus: "HITL_REQUIRED",
    hitlActionRequired: true,
    suggestedFollowUps: [
      "Inspect turbine ST-401 pending HITL record",
      "What is the procedure for cooling water pump switchover?",
      "How does the anti-surge controller protect Wet Gas Compressor K-301?"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-010",
    question: "What are the mandatory personal protective equipment (PPE) and exposure limits for H2S in SRU-2?",
    keywords: ["h2s", "sulfur", "sru", "ppe", "safety", "msds", "toxic", "hazard", "respirator", "hse", "retrieve safety procedures", "exposure limits", "sru-2"],
    intent: "safety",
    categoryLabel: "HSE & Chemical Safety",
    answer: "Hydrogen Sulfide (H2S) in Sulfur Recovery Unit SRU-2 is an acute neurotoxin with permissible exposure limit (OSHA PEL Ceiling) of 20 ppm and IDLH (Immediately Dangerous to Life or Health) of 100 ppm. Mandatory requirements under HSE-MSDS-H2S: (1) Continuously calibrated multi-gas personal monitor (alarm set at 5 ppm low, 10 ppm high) clipped in breathing zone. (2) For line breaking, catalyst dumping, or entering Claus furnace battery limit: positive-pressure self-contained breathing apparatus (SCBA) or supplied-air respirator with 5-minute escape cylinder. (3) Fire-retardant anti-static Nomex coveralls, chemical nitrile outer gloves, safety goggles, and steel-toe chemical boots. Never enter alone; buddy system is strictly required.",
    citations: [
      { docId: "MSDS-H2S-2025", title: "Material Safety Data Sheet: Hydrogen Sulfide Gas", section: "§8 Exposure Controls & Personal Protection", page: 4, confidence: 0.99 },
      { docId: "HSE-SRU-SOP", title: "Safe Entry & Work Permit in Sulfur Units", section: "§3.2 SCBA Protocols", page: 16, confidence: 0.98 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "What are the emergency first-aid protocols for H2S inhalation?",
      "What actions to take on Flare Gas Recovery trip?",
      "View Benzene & H2S Chemical Safety Data record"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-011",
    question: "Where is safety relief valve PSV-2041 located and what is its set cracking pressure?",
    keywords: ["psv-2041", "valve", "relief valve", "set pressure", "p&id", "location", "pressure relief", "crude fractionator tower c-401", "c-401 dcs telemetry", "analyze equipment logs"],
    intent: "engineering",
    categoryLabel: "Asset & P&ID Specification",
    answer: "Safety Relief Valve PSV-2041 is installed on the overhead vapor line of Crude Distillation Fractionator Tower C-401 (Line 24\"-VAP-4011-CS, Elevation +42.5m, Column Top Platform). According to Mechanical Equipment Datasheet MDS-PSV-2041 and P&ID DWG-CDU-401: Set cracking pressure is 4.80 barg (70 psig), cold test pressure 4.95 barg. Relieving capacity is 185,000 kg/hr of hydrocarbon vapor discharged directly into the High Pressure Flare Header line 36\"-FL-4001. Isolation car-seal locked open (CSO) per API 520/521 standards.",
    citations: [
      { docId: "MDS-PSV-2041", title: "Mechanical Equipment Datasheet: PSV-2041", section: "Process Conditions & Sizing", page: 2, confidence: 0.99 },
      { docId: "DWG-CDU-401", title: "P&ID Drawing: Crude Fractionator Tower Overhead C-401", section: "Grid Coordinate D-7", page: 1, confidence: 0.97 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "Open P&ID Drawing C-401 in interactive viewer",
      "What is the inspection frequency for relief valve PSV-2041?",
      "What is the depressurization sequence for Hydrocracker HCU-3?"
    ],
    requiredModel: "Qwen-2.5-VL-Multimodal"
  },
  {
    id: "kb-012",
    question: "How does the model gateway select between Llama-3-8B and Qwen-2.5-VL for different tasks?",
    keywords: ["model gateway", "routing", "selector", "router", "vision", "qwen", "llama", "inference"],
    intent: "architecture",
    categoryLabel: "Model Routing & Gateway",
    answer: "The Model Gateway utilizes a lightweight intent & modality classifier: (1) When the input contains document images, scanned blueprints, engineering drawings, or spatial tags, the query is routed to Qwen-2.5-VL-7B for multimodal visual-token reasoning. (2) Pure text operational procedures, alarm analysis, and SOP Q&A are dispatched to Llama-3-8B-Industrial (vLLM) for ultra-fast generation (80+ tokens/sec). (3) Deterministic mathematical equations and valve flow rate calculations bypass the neural model entirely and are solved by an internal Python validator to guarantee 100% numerical precision.",
    citations: [
      { docId: "GATEWAY-ROUTER-SPEC", title: "Intelligent Model Routing Specification", section: "§2.1 Modality Classifier", page: 5, confidence: 0.98 },
      { docId: "SYS-VAL-03", title: "Deterministic Calculation Engine Architecture", section: "§1.4 Flow Rate Formulas", page: 3, confidence: 0.96 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "Check live model telemetry and latency",
      "Switch active model in demo settings",
      "How does the workbench parse P&ID diagrams?"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-013",
    question: "What telemetry and audit events are captured during an operator's session?",
    keywords: ["audit", "telemetry", "logs", "tracking", "compliance", "immutable", "rbac", "events"],
    intent: "policy",
    categoryLabel: "Audit & Compliance",
    answer: "In compliance with ISO 27001 and IEC 62443, Alpha-6 writes an append-only, SHA-256 chained audit log for every transaction: (1) Operator authenticated ID and RBAC role. (2) Exact prompt text and tokenized representation. (3) Policy gate verdict (Allow / Deny / Redact) and matched rule IDs. (4) Retrieved vector chunk IDs and similarity cosine distances. (5) Model name, version hash, latency (ms), and GPU VRAM consumed. (6) HITL approval signatures and timestamps. Logs can be exported as cryptographically verifiable JSON packages for government or internal safety board audits.",
    citations: [
      { docId: "AUD-SPEC-2026", title: "Immutable Audit Trail Specification", section: "§2.3 Block Hashing", page: 8, confidence: 0.99 },
      { docId: "GOV-COMP-01", title: "Government Tech Regulatory Compliance Guide", section: "§5.1 Evidence Export", page: 13, confidence: 0.97 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "Export current session audit log",
      "View live analytics and policy interceptions",
      "What is the Grounded Answer Rate?"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-014",
    question: "What is the immediate procedural action for loss of flame in atmospheric heater F-101?",
    keywords: ["flame-out", "heater", "furnace", "f-101", "loss of flame", "cdu", "fuel gas", "purge"],
    intent: "operations",
    categoryLabel: "Emergency Procedures",
    answer: "Immediate flame-out response under SOP-CDU-EM-004: (1) DCS Operator immediately activates Emergency Fuel Trip button PB-F101-TRIP, slamming shut Main Fuel Gas Emergency Shutoff Valve XV-1001 and pilot valve XV-1002 in <1.0 second. (2) Open furnace stack damper to 100% position immediately to vent residual unburned fuel gas. (3) Inject snuffing steam into the radiant firebox at maximum valve travel to inert the atmosphere and suppress explosion risk. (4) Maintain crude charge pump flow through convection tubes to prevent tube overheating and coking. (5) Do NOT attempt to relight burners until minimum 15-minute 5-volume air purge is completed and combustible gas detector confirms <5% LEL.",
    citations: [
      { docId: "SOP-CDU-EM-004", title: "Atmospheric Furnace F-101 Emergency Operations", section: "§3.2 Total Flame-Out Sequence", page: 18, confidence: 0.99 },
      { docId: "NFPA-85-BOILER", title: "Standard for Boiler and Combustion Systems Hazards", section: "§5.4 Purge Requirements", page: 41, confidence: 0.95 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "What triggers automated ESD-101?",
      "How to respond to Boiler Feedwater pH drop?",
      "What is the step-by-step depressurization for Hydrocracker?"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-015",
    question: "What is the standard procedure for switching from main pump P-102A to standby P-102B?",
    keywords: ["pump", "switchover", "p-102a", "p-102b", "cooling water", "standby", "priming", "maintenance"],
    intent: "operations",
    categoryLabel: "Operating Procedures",
    answer: "Per SOP-CW-022 Cooling Water Circulation: (1) Pre-start check on standby Pump P-102B: confirm lube oil level in sight glass is at 50%, mechanical seal flush plan 11/52 reservoir is pressurized, suction valve MOV-102B is 100% open, and pump casing vent has cleared all trapped air. (2) Crack open discharge bypass valve. (3) Start P-102B motor from local control station or DCS; observe motor starting current drops back below full-load rating within 4 seconds. (4) Slowly open main discharge valve MOV-104B over 20 seconds while simultaneously throttling P-102A discharge MOV-104A to maintain steady header pressure (minimum 4.2 barg). (5) Stop P-102A motor, close its discharge valve, and lock out tag out (LOTO) for scheduled maintenance.",
    citations: [
      { docId: "SOP-CW-022", title: "Cooling Water System Pump Operating Manual", section: "§6.1 Pump Changeover Procedure", page: 14, confidence: 0.97 },
      { docId: "PMP-DS-102", title: "Centrifugal Pump P-102A/B Equipment Specification", section: "Mechanical Seal Flush Plan", page: 7, confidence: 0.93 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "View Cooling Water Pump P-102B failure sample record",
      "How to respond to high vibration alarm on Steam Turbine?",
      "Where is safety relief valve PSV-2041 located?"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-016",
    question: "How to mitigate a rapid temperature excursion (>730°C) in the FCCU regenerator bed?",
    keywords: ["fccu", "regenerator", "temperature", "afterburning", "catalyst", "excursion", "fluid catalytic"],
    intent: "operations",
    categoryLabel: "Process Operations",
    answer: "Regenerator bed temperatures exceeding 730°C indicate severe afterburning or excess hydrocarbon carryover. Actions per SOP-FCCU-OPS-031: (1) Immediately reduce raw oil feed rate to reactor riser by 25% via FCV-201. (2) Increase Regenerator Torch Oil or CO boiler combustion steam injection to absorb heat. (3) If combustion air blower flow is excessive, adjust air grid control valve PCV-220 to limit oxygen content in flue gas to <0.5 vol%. (4) Inject catalyst cooler steam if auxiliary cooler is on-line. (5) If bed temperature approaches metallurgical limit (760°C), activate emergency feed cut switch to divert gas oil feed to storage tankage.",
    citations: [
      { docId: "SOP-FCCU-OPS-031", title: "Fluid Catalytic Cracking Unit Abnormal Operations", section: "§9.2 Regenerator Thermal Runaway", page: 53, confidence: 0.98 },
      { docId: "LIC-UOP-FCC", title: "UOP FCC Process Technology Manual", section: "Regenerator Heat Balance", page: 112, confidence: 0.95 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "Inspect FCCU Regenerator Temperature Spike incident record",
      "What is the emergency depressurization sequence for Hydrocracker?",
      "How are proprietary catalyst formulas redacted?"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-017",
    question: "Why use hybrid dense vector + BM25 keyword search for industrial plant documentation?",
    keywords: ["hybrid", "qdrant", "bm25", "dense", "sparse", "vector", "search", "retrieval", "equipment tags"],
    intent: "architecture",
    categoryLabel: "Retrieval Architecture",
    answer: "Industrial plant documentation has a unique retrieval challenge: engineers search both for conceptual semantics ('how do I isolate runaway heat') and exact alphanumeric equipment tags ('XV-1001', 'PSV-2041', 'P&ID 24\"-VAP-4011'). Pure dense vector embeddings frequently blur distinct tag numbers (confusing XV-1001 with XV-1002). Alpha-6 combines Qdrant dense vector search (capturing contextual and semantic intent) with BM25 sparse lexical search (anchoring exact token matches for asset tags and valve IDs). Reciprocal Rank Fusion (RRF) merges both rankings to produce 99.1% citation precision.",
    citations: [
      { docId: "SYS-RET-01", title: "Hybrid Retrieval Benchmark in Chemical Processing", section: "§3.4 RRF Weighting Matrix", page: 11, confidence: 0.99 },
      { docId: "QDRANT-MRPL", title: "On-Premises Qdrant Deployment Guidelines", section: "§2.1 Payload Filtering", page: 6, confidence: 0.97 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "How does the workbench parse P&IDs?",
      "What is the system latency and token throughput?",
      "What is the Grounded Answer Rate?"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-018",
    question: "What corrective dosing is required when Boiler B-201 feedwater pH drops below 8.8?",
    keywords: ["boiler", "ph", "feedwater", "dosing", "corrosion", "ammonia", "water treatment", "b-201"],
    intent: "maintenance",
    categoryLabel: "Water Treatment & Boiler",
    answer: "Feedwater pH below 8.8 accelerates acidic carbonic acid attack on boiler economizer tubes. Corrective actions per SOP-BLR-WT-008: (1) Verify online analyzer pH-201 against laboratory grab sample titration. (2) Increase dosing stroke rate on Ammonia / Morpholine injection metering pump MP-201A by 20% to restore pH into the specification range (9.2 – 9.6). (3) Check Dearator DA-201 operating temperature (must be >= 105°C) and venting rate to confirm dissolved CO2 stripping. (4) If dissolved oxygen exceeds 7 ppb, adjust sodium sulfite / hydrazine oxygen scavenger dosing pump MP-202 proportionally.",
    citations: [
      { docId: "SOP-BLR-WT-008", title: "High-Pressure Utility Boiler Water Chemistry", section: "§4.3 Volatile Alkalinity Control", page: 27, confidence: 0.98 },
      { docId: "ASME-BLR-SEC1", title: "ASME Guidelines for Water Quality in Industrial Boilers", section: "Table 2 Recommended Chemistry", page: 19, confidence: 0.94 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "What is the standard procedure for pump switchover?",
      "What triggers automated ESD-101?",
      "How to respond to furnace flame-out?"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-019",
    question: "What actions must be taken if the liquid seal drum level rises above 85% in the Flare Gas Recovery System?",
    keywords: ["flare", "fgrs", "liquid seal", "seal drum", "flare header", "relief", "drainage"],
    intent: "operations",
    categoryLabel: "Environmental & Flare Systems",
    answer: "Liquid seal drum level >85% threatens water slugging into the flare tip and creates dangerous backpressure on upstream relief valves. Standard Response SOP-FLR-014: (1) DCS Operator verifies differential pressure transmitter PDT-4012 across seal drum. (2) Open automated drain control valve LCV-4015 to dump seal water into oily water sewer until level returns to normal setpoint (65%). (3) Start standby recovery pump P-402B if main pump P-402A is failing to evacuate condensed hydrocarbon liquids. (4) Notify Environmental HSE Desk; if continuous relief continues, prepare to bypass flare gas compressor K-401 to prevent compressor liquid ingestion trip.",
    citations: [
      { docId: "SOP-FLR-014", title: "Flare System & Liquid Knockout Drum Operating Protocol", section: "§7.2 High Level Mitigation", page: 23, confidence: 0.98 },
      { docId: "ENV-MRPL-FLR", title: "Volatile Organic Compound Flare Compliance Manual", section: "§3.1 Seal Integrity", page: 8, confidence: 0.95 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "What are the exposure limits for H2S in SRU-2?",
      "Where is safety relief valve PSV-2041 located?",
      "Review sample records in the vault"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-020",
    question: "How are new open-weight model checkpoints validated and loaded into the air-gapped workbench?",
    keywords: ["checkpoints", "weights", "air-gapped update", "model registry", "validation", "safetensors", "supply chain"],
    intent: "architecture",
    categoryLabel: "Sovereign Operations",
    answer: "In an air-gapped refinery facility, model checkpoints cannot be pulled via Hugging Face or public registries. Instead, updates follow our Sovereign Air-Gap Ingestion Protocol: (1) Signed safetensors weights are transported on encrypted write-blocked physical media (FIPS 140-2 Level 3). (2) Ingestion workstation runs automated vulnerability scans (Pickle/deserialization code inspection, tensor integrity hash checking). (3) The weights are copied to the on-premise Model Registry storage volume. (4) The vLLM serving container performs an offline warm-up sanity check against 100 benchmark plant queries. Only upon passing the 98% factuality threshold is the model activated in production.",
    citations: [
      { docId: "SOP-SEC-MODEL-01", title: "Air-Gapped AI Model Ingestion & Verification Procedure", section: "§4.1 Safetensors Inspection", page: 9, confidence: 0.99 },
      { docId: "GOV-COMP-01", title: "Government Tech Regulatory Compliance Guide", section: "§8.3 Physical Media Transfer", page: 34, confidence: 0.97 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "How does Alpha-6 guarantee zero data egress?",
      "What open-weight models are currently hosted?",
      "What telemetry is captured during operator sessions?"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-021",
    question: "What are the redundant level transmitter alarms for Benzene Storage Tank T-502?",
    keywords: ["benzene", "tank", "t-502", "level", "overfill", "storage", "alarms", "spill"],
    intent: "safety",
    categoryLabel: "Storage & HSE Safety",
    answer: "Benzene Tank T-502 (Floating Roof, 25,000 m³ capacity) is equipped with dual redundant non-contact radar level transmitters (LT-502A and LT-502B) plus an independent hardwired high-high level magnetic switch (LSHH-502): High Alarm (LAH) triggers at 88% capacity (DCS warning); High-High Alarm (LAHH) triggers at 94% capacity, causing immediate automated trip of inlet motor-operated valve MOV-5021 and sounding local siren per API 2350 Overfill Protection standards.",
    citations: [
      { docId: "SOP-TK-502", title: "Benzene Tankage Operations & Overfill Protection", section: "§3.4 Alarm Matrix", page: 12, confidence: 0.99 },
      { docId: "API-2350-OVERFILL", title: "Overfill Protection for Storage Tanks in Petroleum Facilities", section: "§5.2 Category 3 Systems", page: 28, confidence: 0.96 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "What are the PPE requirements for Benzene?",
      "What is the procedure for Flare Gas Recovery trip?",
      "View Benzene MSDS sample record"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  },
  {
    id: "kb-022",
    question: "How does the anti-surge controller protect Wet Gas Compressor K-301?",
    keywords: ["compressor", "surge", "k-301", "anti-surge", "wet gas", "flow", "fccu", "pressure ratio"],
    intent: "engineering",
    categoryLabel: "Rotating Machinery & Controls",
    answer: "Anti-surge controller UIC-301 calculates proximity to the surge limit line using suction flow differential pressure (FT-3011) and pressure ratio across the impeller (PT-3012 / PT-3011). If operating point enters the 10% safety margin surge control line, UIC-301 rapidly modulates pneumatic recycle valve FCV-3015 open to return high-pressure discharge gas back to suction scrubber V-301. If a sudden trip occurs on downstream fractionator, fast-acting hydraulic kick-out valve XV-3018 strokes 100% open in <0.8 seconds to completely decouple compressor from process backpressure.",
    citations: [
      { docId: "SPEC-K301-CTRL", title: "Wet Gas Compressor Anti-Surge Control Philosophy", section: "§4.2 Fast-Stroke Logic", page: 19, confidence: 0.98 },
      { docId: "DWG-K301-PID", title: "P&ID Drawing: K-301 Wet Gas Compressor Circuit", section: "Sheet 1 of 3", page: 1, confidence: 0.95 }
    ],
    policyStatus: "ALLOWED",
    suggestedFollowUps: [
      "How to respond to Steam Turbine high vibration?",
      "What is the step-by-step procedure for pump changeover?",
      "Where is safety relief valve PSV-2041 located?"
    ],
    requiredModel: "Llama-3-8B-Industrial"
  }
];

export const SUGGESTED_QUERIES = [
  "What is the safe startup procedure for Pump P-204?",
  "Explain an alarm: Steam Turbine ST-401 High Vibration",
  "Find an SOP: Safe startup procedure for Heavy Crude Booster Pump P-204",
  "Analyze equipment logs: Crude Fractionator Tower C-401 DCS Telemetry",
  "Retrieve safety procedures: Mandatory PPE and exposure limits for H2S in SRU-2",
  "What is the step-by-step emergency depressurization protocol for Hydrocracker Unit HCU-3?",
  "Where is safety relief valve PSV-2041 located and what is its set cracking pressure?",
  "How does Alpha-6 guarantee zero data egress in an air-gapped refinery network?"
];
