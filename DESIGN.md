---
name: Alpha-6 Sovereign Industrial Design System
version: 1.0.0
description: High-density, professional sovereign industrial workbench design tokens and guidelines.
colors:
  primary: "#10B981"
  secondary: "#06B6D4"
  tertiary: "#F59E0B"
  neutral: "#07090E"
  surface: "#0C1017"
  surface-card: "#0F141F"
  surface-elevated: "#151C2A"
  on-surface: "#F8FAFC"
  text-secondary: "#94A3B8"
  text-muted: "#64748B"
  critical: "#EF4444"
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.06em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
spacing:
  base: 16px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
rounded:
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
---

# Alpha-6 Sovereign Industrial Design System

## Design Philosophy & Tone

The Alpha-6 user interface is designed specifically for **confidential, safety-critical industrial command centers** (refineries, petrochemical units, and power plants). It moves deliberately away from generic "AI-slop"—avoiding neon blobs, excessive bubbly border radii, and oversized cartoonish buttons.

Instead, the aesthetic draws inspiration from high-performance developer and mission-control software (Linear, Palantir Foundry, Raycast, and Vercel):
- **High Information Density**: Compact, legible typography scales with minimal wasted padding.
- **Micro-Borders & Architectural Sharpness**: Subtle 1px borders (`border-white/[0.08]`) and hairline dividers convey rigid industrial precision.
- **Restrained Color Palettes**: A deep obsidian base (`#07090e` and `#0c1017`) accented with crisp functional indicators:
  - **Sovereign Emerald (`#10B981`)**: Verified evidence, air-gapped status, and healthy telemetry.
  - **Cyber Cyan (`#06B6D4`)**: Multimodal P&ID vector analysis and local inference.
  - **Safety Amber (`#F59E0B`)**: Human-In-The-Loop (HITL) supervisory review gates.
  - **Critical Crimson (`#EF4444`)**: Emergency shutdown trips and telemetry anomalies.

## Typography

The typography strategy leverages two distinct typefaces:
- **Headlines & Narrative:** Set in **Plus Jakarta Sans** (weights 500 and 600) with tight tracking (`-0.015em` to `-0.02em`) to produce a modern, engineered presence without visual clutter.
- **Telemetry & Technical Tags:** Set in **JetBrains Mono** with strict tabular figures (`tabular-nums`) and uppercase tracking for equipment tags (e.g., `PSV-2041`, `ST-401`, `BDV-301A`), latency metrics, and cryptographic hashes.

## Elevation & Depth

Visual hierarchy is communicated through **structural tonal layering** and **hairline inner highlights**:
- **Layer 0 (Canvas):** Deep dark obsidian `#07090E`.
- **Layer 1 (Card/Container):** Frosted charcoal `#0C1017` with subtle top highlight `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]`.
- **Layer 2 (Interactive Overlays):** Matte navy `#151C2A` with fine border `border-slate-800`.
- Heavy drop shadows are avoided; instead, gentle glows are reserved exclusively for critical active alerts (e.g. HITL approval required).

## Layout & Spatial Rhythm

Layout follows an 8px spatial grid with 4px micro-steps:
- Maximum container width bounded at `max-w-7xl` (1280px) for consistent eye-tracking.
- Navigation utilizes a compact, segmented control bar with clean active indicators.
- Information cards employ a two-column or multi-metric horizontal distribution to eliminate unnecessary vertical scrolling.

## Component Specifications

- **Segmented Tabs:** Compact pills with muted backgrounds, sharp text, and seamless active transitions.
- **Metric Cards:** Clean three-line stack: Micro-label (10px uppercase mono) → Value (tabular-nums with accent color) → Subtext badge.
- **Blueprint Schematic:** Dark navy technical grid canvas with vector piping and crisp ISA-5.1 interactive symbol tags.
- **Copilot Message Bubbles:** Distinct roles (Operator vs Sovereign AI) with source citation chips and policy status badges.
- **HITL Modals:** Frosted glass backdrop with immediate focus trapping, clear action verbs ("Authorize & Dispatch to DCS"), and keyboard escape handlers.

## Do's and Don'ts

- **DO** use tabular numerals (`tabular-nums`) for all telemetry numbers, counts, and timers.
- **DO** keep button padding compact and purposeful; avoid oversized bubbly pill buttons.
- **DO** display evidence citations with exact document and page references.
- **DON'T** introduce bright neon gradients or loud background blur effects that degrade contrast.
- **DON'T** display unstyled parenthetical counters like `( 2 )`; format badges as compact pills (`2`).
- **DON'T** let buttons perform decorative actions without feedback; every action must trigger visual state updates or accessible toasts.
