# [ARCHIVED CONCEPT] "Startup in a Folder" — Autonomous Venture Architecture Specification

> **Status:** ARCHIVED / STASHED FOR FUTURE REFERENCE  
> **Classification:** Conceptual Venture Framework (Not currently in active execution)  
> **Date Stashed:** 2026-10-17  
> **Source Origin:** Deconstructed from Albert Olgaard's AI OS & Monorepo methodologies.

---

## 1. Executive Concept Summary

"Startup in a Folder" is a meta-framework designed to package an entire commercial enterprise—codebase, persistent backend, AI agent skills, marketing assets, legal disclosures, sales funnels, and operating runbooks—into a single, modular, git-versioned monorepo. 

The objective of this framework is to allow a solo founder or small operating collective to run an end-to-end company where autonomous AI agents (Claude Code, Gemini CLI, local terminal agents) can navigate, inspect, maintain, and scale every department without context fragmentation.

---

## 2. Theoretical Monorepo Directory Architecture

```
startup-in-a-folder/
├── .env.example                     # Unified environment template across services
├── fly.toml / cloudrun.yaml         # Cloud container deployment spec
├── package.json                     # Monorepo workspaces definition
├── CONSTRAINTS.md                   # Inviolable brand, legal, and architectural contracts
│
├── apps/
│   ├── web/                         # Presentation Layer (Next.js / Vite)
│   │   ├── app/                     # App Router pages (Minimalist / Linear aesthetic)
│   │   ├── app/api/backend/         # Server-side Thin Proxy Route (/api/backend/[...path])
│   │   └── tailwind.config.js       # Global design tokens and typography
│   │
│   └── api/                         # Execution Layer (FastAPI on Cloud Run / Fly.io)
│       ├── app/
│       │   ├── main.py              # Application entrypoint & CORS
│       │   ├── config.py            # Pydantic v2 settings validation
│       │   ├── routers/             # Webhooks, threads, knowledge base, billing
│       │   ├── services/            # Tier 1 Haiku triage, Atlas RAG, Sonnet drafting, guardrails
│       │   └── models/              # Pydantic data contracts & MongoDB Motor schemas
│       ├── Dockerfile               # Lightweight python:3.12-slim container
│       └── requirements.txt         # FastAPI, Motor, Anthropic, OpenAI, pypdf
│
├── packages/
│   ├── canon/                       # The Sovereign Single Source of Truth
│   │   ├── brand_identity.md        # Tone, voice, proof lines, non-negotiables
│   │   ├── product_catalog.json     # SKUs, pricing ladder, bumps, continuity rules
│   │   ├── world_model.json         # Lore, heroes, developmental domains
│   │   └── legal/                   # Terms, privacy policies, disclaimers
│   │
│   └── agent-skills/                # Custom Terminal Agent Skills
│       ├── ad-creative-generator/   # Multi-hook ad batching prompt engine
│       ├── b2b-lead-enricher/       # Directory scraping & standards crosswalk
│       └── outreach-copywriter/     # 3-touch high-converting email sequences
│
├── campaigns/                       # Pre-compiled Commercial Assets
│   ├── meta/                        # Angle matrices, ad copy, image prompts
│   ├── email/                       # Inbound nurture sequences & cold B2B cadences
│   └── advertorials/                # Pre-sell editorial bridge pages
│
└── operations/                      # Execution Runbooks & Financial Models
    ├── 7_day_launch_sprint.md       # Turnkey execution roadmap
    ├── dns_deliverability_sop.md    # SPF, DKIM, DMARC, MX setup guide
    └── financial_model.xlsx         # Unit economics, CPA targets, LTV simulator
```

---

## 3. Core Architectural Mechanisms

1. **The Thin Proxy Pattern:** The frontend (Vercel) contains zero business logic, zero AI keys, and zero database credentials. It acts purely as an auth gate and UI proxy forwarding to the persistent backend.
2. **2-Tier Model Routing:** Tier 1 sub-second triage (Claude 3.5 Haiku) handles 80% of classification for fractions of a cent; Tier 2 RAG synthesis (Claude 3.5/3.7 Sonnet) handles drafting.
3. **Single Vector & Document Store:** MongoDB Atlas handles relational workspace data, thread history, and vector similarity search in one database.
4. **Deterministic Guardrails:** Hard-coded program rules override model confidence to prevent rogue automated sends (loop prevention, legal/refund escalation).

---

## 4. Reason for Stashing

This document is preserved for when the operator is ready to package a new business idea into a turnkey, modular folder or spin out an independent venture. It remains detached from active day-to-day operations.
