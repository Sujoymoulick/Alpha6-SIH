# 🏭 Alpha-6: Sovereign Industrial AI Workbench
> **Smart India Hackathon 2026** | **Problem Statement: SIH26117**  
> *Air-Gapped, Zero-Hallucination Industrial Intelligence & Human-in-the-Loop Operational Copilot*

[![SIH 2026](https://img.shields.io/badge/SIH-2026%20Hackathon-blue?style=for-the-badge&logo=shield)](https://sih.gov.in)
[![Problem Statement](https://img.shields.io/badge/Problem%20Statement-SIH26117-amber?style=for-the-badge)](https://sih.gov.in)
[![Framework](https://img.shields.io/badge/Framework-Astro%207%20SSR-orange?style=for-the-badge&logo=astro)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel%20%7C%20On--Premise-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Compliance](https://img.shields.io/badge/Security-IEC%2062443%20SL3%20%7C%20Purdue%20Level%203-emerald?style=for-the-badge)](#)

---

## 📌 Executive Summary

Modern industrial facilities (oil refineries, thermal power stations, petrochemical complexes, and continuous manufacturing plants) generate petabytes of operational documents, P&ID schematics, operating procedures (SOPs), and SCADA telemetry. 

However, enterprise operators cannot utilize public cloud AI services due to:
1. **Critical Air-Gap Mandates**: Strict physical and network isolation preventing any telemetry or prompt egress to the public internet.
2. **Hallucination Risk**: Generic LLMs inventing process parameters or valve actions could cause multimillion-dollar asset damage or human catastrophe.
3. **Lack of Supervisory Governance**: Autonomous AI decision-making without explicit Human-in-the-Loop (HITL) authorization breaches industrial safety regulations (SIL-2/3, OSHA PSM, IEC 61511).

**Alpha-6** is a sovereign, on-premise industrial AI workbench engineered specifically to solve **SIH26117**. It runs 100% locally on air-gapped compute hardware, grounds every recommendation in authoritative engineering SOPs and P&ID drawings with mathematical citations, enforces policy-as-code guardrails, and mandates digital cryptographic sign-offs before any operational action reaches DCS/SCADA systems.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph AirGapBoundary["🛡️ Purdue Level 3 Air-Gapped Security Perimeter"]
        direction TB

        subgraph Ingestion["1. Knowledge Ingestion & Vectorization"]
            SOP["Engineering SOPs (PDF)"]
            DWG["P&ID Blueprints (CAD/SVG)"]
            SCADA["DCS/SCADA Telemetry Logs"]
            OCR["Multimodal Vision Tokenizer (Qwen-2.5-VL)"]
            Qdrant["Local Qdrant Vector Store (BGE-Large)"]
            SOP --> OCR --> Qdrant
            DWG --> OCR --> Qdrant
            SCADA --> Qdrant
        end

        subgraph CoreEngine["2. Local Sovereign Inference Engine"]
            vLLM["Local Serving Gateway (vLLM v0.6.2)"]
            Model["Llama-3-8B-Industrial (AWQ 4-Bit)"]
            KV["PagedAttention KV Cache (Zero Fragmentation)"]
            vLLM --- Model
            vLLM --- KV
        end

        subgraph Guardrails["3. Policy-as-Code & Redaction Gate"]
            OPA["Open Policy Agent (Rego Engine)"]
            Rule1["Rule #POL-402: Mask Proprietary Catalyst"]
            Rule2["Rule #POL-501: Block Critical Valve Overrides"]
            Rule3["Rule #POL-108: Restrict Pressure Deviations > 10%"]
            OPA --> Rule1
            OPA --> Rule2
            OPA --> Rule3
        end

        subgraph HITL["4. Supervisory Escrow & Digital Sign-Off"]
            Escrow["Operational Action Escrow Queue"]
            Audit["Immutable Cryptographic Merkle Ledger (SHA-256)"]
            Supervisor["Lead Process Engineer (Digital Signature)"]
            Escrow --> Supervisor
            Supervisor --> Audit
        end

        subgraph Execution["5. Distributed Control System (DCS) Bridge"]
            DCS["Yokogawa / Honeywell DCS Modbus Bridge"]
            Supervisor -- "Authorized Command" --> DCS
        end
    end

    Qdrant --> CoreEngine
    CoreEngine --> Guardrails
    Guardrails --> Escrow
```

---

## ✨ Key Modules & Capabilities

### 1. 📊 Industrial Command Center Overview
- **Executive KPI Strip**: Real-time tracking of knowledge retrieval accuracy (98.4%), citation coverage (100%), local inference latency (42ms), pending supervisory approvals, and policy interceptions.
- **Dynamic Equipment Status**: Live donut chart monitoring 384 refinery units across CDU-1, VDU-2, HCU-3, and Utilities.
- **Inference Histogram**: Real-time token latency distribution (<50ms, 50-100ms, >100ms).
- **Supervisory Escrow Alert**: High-priority alert banner triggering instant HITL evaluation.

### 2. 🤖 Plant Copilot (3-Pane Industrial Assistant)
- **Session Rail**: Quick switching between active process queries (Pump startup, valve troubleshooting, boiler trip recovery).
- **Chat Workspace**: Industrial conversation engine with quick prompt chips for SOP lookup, alarm analysis, and emergency checklists.
- **Evidence Inspector**: Contextual side drawer displaying page-level SOP citations, document excerpts, safety constraints (SIL-2/3), and retrieval confidence scores (0.99+).

### 3. 📐 Multimodal Agent Studio (P&ID Analyzer)
- **Interactive Blueprint Canvas**: Crisp blueprint schematic viewer with interactive SVG equipment nodes (Distillation Column, Reflux Pumps, Emergency Flare Header, Critical Relief Valves).
- **Tag Inspector Drawer**: Clicking any equipment node pulls real-time telemetry (Flow rates, suction pressure, motor vibration, temperature) from simulated DCS registers.
- **5-Stage Telemetry Pipeline**: Visual step execution tracking:
  `Blueprint OCR` ➔ `Symbol Parsing` ➔ `Line Tracing` ➔ `Isolation Validation` ➔ `Digital Permit Dispatch`.

### 4. 📚 Knowledge Vault & Document Management
- **Enterprise Document Index**: SOPs, P&ID drawings, HAZOP studies, vendor manuals, and alarm response matrices.
- **Vector Metadata Filtering**: Filter by Document Type (`SOP`, `P&ID`, `Manual`, `Incident`), Plant Unit (`CDU-1`, `HCU-3`, `Utilities`), and Security Classification (`Restricted`, `Confidential`, `Internal`).
- **Detailed Document Drawer**: Inspect chunk count, embedding model, SHA-256 cryptographic checksum, and one-click query dispatch to Copilot.

### 5. 🛡️ Operational Records & Supervisory HITL Escrow
- **Incident & Escrow Ledger**: Track critical anomalies (Turbine vibration, pump mechanical seal leaks, furnace tube hot spots).
- **Digital Sign-Off Dialog**: Supervisory approval workflow requiring digital signatures before dispatching setpoint changes to the plant.
- **Audit Trails**: Every approval or rejection is recorded with operator identity, timestamp, and safety assessment notes.

### 6. ⚡ System Telemetry & Accelerators
- **On-Premise GPU Monitoring**: Dual NVIDIA H100 SXM5 (80GB VRAM) telemetry with live utilization, temperature, and memory consumption.
- **Hardware Egress Monitor**: eBPF driver simulation ensuring zero bytes leave the Purdue Level 3 network boundary.

### 7. ⚖️ Policy-as-Code Engine (OPA / Rego)
- **Deterministic Guardrails**: Live policy engine that intercepts prompts and responses to enforce industrial safety standards.
- **Interactive Simulator**: Test proprietary catalyst masking, unauthorized valve override blocking, and pressure deviation containment.

### 8. 🔒 Immutable Cryptographic Audit Ledger
- **Merkle Tree Integrity**: Every query, prompt, retrieved chunk, and supervisory sign-off is hashed (SHA-256) into a cryptographic chain.
- **Exportable Evidence**: Regulatory audit trail exportable for PESO, OISD, and OSHA compliance inspections.

### 9. 🎛️ Model Gateway & Serving Controls
- **Checkpoint Registry**: Switch between `Llama-3-8B-Industrial` (vLLM), `Qwen-2.5-VL-7B` (Multimodal Vision), and `Mistral-7B-Plant` (Ollama Edge).
- **Deterministic Tuning**: Temperature constrained to `0.10` to guarantee zero hallucination against retrieved documents.

### 10. 👥 Industrial RBAC & Purdue Security
- **Role Hierarchy**: Strict segregation of duties across Lead Process Engineer (Supervisor), Shift DCS Operator (Console), Chief Safety Auditor (Compliance), and Maintenance Lead (LOTO).
- **Persona Switcher**: Seamless live presentation mode to test actions from multiple operator viewpoints.

---

## 🎨 Design Philosophy: Executive Light Dashboard

Designed for high-reliability engineering control rooms and executive dashboards:
- **Dotted Grid Background**: `#f1f5f9` with subtle `#cbd5e1` radial dots (20px spacing) creating an open, distraction-free spatial feel without claustrophobic cards.
- **Floating Architecture**: Floating navigation rail, floating top header, and modular white content cards (`border-slate-200/90 rounded-2xl shadow-xs`).
- **Precision Color System**:
  - 🔵 **Vibrant Blue (`#1d4ed8`)**: Primary actions, active navigation states, and verified citations.
  - 🟢 **Subtle Emerald (`#10b981`)**: Healthy equipment, online engines, and verified Merkle nodes.
  - 🟡 **Warm Amber (`#f59e0b`)**: Supervisory HITL escrow requirements and warning states.
  - 🔴 **Crimson Red (`#ef4444`)**: Critical alerts and rejected operations.
- **Technical Typography**: Plus Jakarta Sans for executive hierarchy paired with JetBrains Mono for tags, hashes, and telemetry data.

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js**: `v22.12.0` or higher
- **npm**: `v10.0.0` or higher

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/Sujoymoulick/Alpha6-SIH.git
cd Alpha6-SIH

# 2. Install dependencies (including Tailwind v4 & Vercel adapter)
npm install

# 3. Start local development server
npm run dev
```

Open `http://localhost:4321` in your browser.

---

## ☁️ Deployment Guide

### Deploying to Vercel (1-Click Ready)
The repository includes full `@astrojs/vercel` serverless adapter support configured in `astro.config.mjs`.

1. Push this repository to GitHub:
   ```bash
   git push -u origin main
   ```
2. Import the repository into [Vercel Dashboard](https://vercel.com/new).
3. Vercel automatically detects Astro and applies:
   - **Framework Preset**: Astro
   - **Build Command**: `npm run build`
   - **Output Directory**: `.vercel/output`
4. Click **Deploy**.

*Note: In `astro.config.mjs`, the adapter automatically activates `@astrojs/vercel` whenever `process.env.VERCEL` is detected.*

### Deploying to On-Premise / Air-Gapped Docker
For air-gapped refinery deployment on local servers:

```bash
# Build standalone Node.js production bundle
npm run build

# Run the standalone server
node ./dist/server/entry.mjs
```

---

## ⌨️ Control-Room Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `1` | Jump to **Overview Dashboard** |
| `2` | Jump to **Plant Copilot** |
| `3` | Jump to **Agent Studio (P&ID)** |
| `4` | Jump to **Knowledge Vault** |
| `5` | Jump to **Operational Records (HITL)** |
| `6` | Jump to **System Telemetry** |
| `7` | Jump to **Policy Engine** |
| `8` | Jump to **Audit Trail** |
| `9` | Jump to **Model Configuration** |
| `0` | Jump to **Access Control (RBAC)** |
| `/` | Focus Copilot Chat Input |
| `?` | Open Keyboard Shortcuts Modal |
| `Esc` | Close any active modal or drawer |

---

## 🔌 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/chat` | `POST` | Industrial Q&A inference with SOP citations and safety constraints |
| `/api/records` | `GET` / `POST` | Retrieve operational records and execute HITL supervisory sign-off |
| `/api/vault` | `GET` | Retrieve indexed engineering documents, classifications, and chunk counts |
| `/api/analytics` | `GET` | Hardware accelerator utilization, throughput metrics, and query logs |
| `/api/health` | `GET` | System health check (Local LLM, Vector Store, eBPF Air-Gap) |
| `/api/demo/reset` | `POST` | Reset benchmark state to initial evaluation scenario |

---

## 🏆 Smart India Hackathon 2026 Deliverable Checklist

- [x] **Air-Gapped Local Inference Engine** (vLLM / Ollama architecture)
- [x] **Zero Hallucination Retrieval** (100% citation coverage on SOPs & P&IDs)
- [x] **Multimodal Blueprint Analysis** (ISA-5.1 tag recognition & valve tracing)
- [x] **Human-in-the-Loop Supervisory Escrow** (Digital signatures for DCS commands)
- [x] **Policy-as-Code Safety Gate** (OPA / Rego deterministic redactions)
- [x] **Cryptographic Immutable Audit Chain** (Merkle tree SHA-256 logs)
- [x] **Executive Control-Room UI** (Modern light dotted grid design)
- [x] **Vercel & Docker Deployment Ready** (Universal dual adapter)

---

## 📄 License & Attribution

Developed for **Smart India Hackathon 2026 (Problem Statement SIH26117)**.  
Built by **Team Alpha-6**. All rights reserved under the MIT License.
