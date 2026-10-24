# 🤖 Nanobot 50 Micro-Curator Reconnaissance & Seeding Pipeline Plan

> **For Claude / Antigravity Execution:** Implements autonomous reconnaissance to harvest, filter, and qualify 50 verified micro-curators (15k–85k followers) across Instagram, TikTok, and Pinterest for The Sound of Essentials: Rhythm Quest.

**Goal:** Build and execute an automated reconnaissance pipeline using Nanobot and social intelligence tools to harvest 50 vetted early childhood micro-curators across 5 canonical demographic clusters, establishing the database and turnkey outreach kits for the Def Jam $30–$60 seeding arbitrage.

**Architecture:** A 4-stage pipeline: (1) Cluster-targeted query generation, (2) Multi-platform scraping (IG, TikTok, Pinterest) with strict follower/engagement filters, (3) JSON ledger & CRM enrichment (`docs/soe_50_micro_curators_registry.json`), and (4) Turnkey outreach payload generation mapping each creator to one of the 5 canonical Seeding Kits.

**Tech Stack:** Python 3.12+ + Nanobot CLI (`~/.nanobot`) + Socialfetch API/MCP + `The-Sound-of-Essentials-Eco-System/tools`

---

## 🎯 Demographic Clusters & Search Vectors (50 Targets Total)

| Cluster ID | Target Niche | Primary Platforms | Search Queries & Hashtags | Target Quota | Assigned Seeding Kit |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **C1** | **Gentle Parenting & Sensory Calm** | Instagram, TikTok | `#gentleparenting`, `#toddlersleep`, `#bedtimeroutine`, `#sensoryco-regulation` | **12 Creators** | `seed_kit_01_bedtime_sensory` |
| **C2** | **Screen-Free Montessori & Tactile** | Instagram, Pinterest | `#screenfreeparenting`, `#montessoritoddler`, `#tactilelearning`, `#lowstimulation` | **10 Creators** | `seed_kit_02_sound_before_symbol` |
| **C3** | **Pre-K Phonics & Homeschool** | Pinterest, Instagram | `#homeschoolprek`, `#phonicsgames`, `#earlyreading`, `#kindergartenprep` | **10 Creators** | `seed_kit_02_sound_before_symbol` |
| **C4** | **ECE Teachers & Circle Time** | TikTok, Instagram | `#preschoolteacher`, `#circletime`, `#teachertransitions`, `#eceteachers` | **10 Creators** | `seed_kit_03_classroom_transition` |
| **C5** | **Intentional Dads & Family Rhythm** | Instagram, TikTok | `#intentionaldad`, `#dadsofinstagram`, `#screentimelimits`, `#raisingkindkids` | **8 Creators** | `seed_kit_04_intentional_dad` |

---

## 🔍 Filtration & Qualification Gate (Strict Criteria)

Every candidate profile must pass all 4 filters to be added to the official 50-Creator Registry:
1. **Follower Band**: **15,000 to 85,000 followers**. (Accounts under 15k lack reach; accounts over 85k are represented by agencies demanding $1,500+).
2. **Engagement Floor**: **$\ge$ 2.5% engagement rate** (Likes + Comments / Follower Count).
3. **Curation / Theme Focus**: Content must feature tips, carousels, resource lists, or storybook routines (not personal selfie blogs).
4. **Direct Contact Channel**: Public bio email, business inquiry DM button, or open DM inbox.

---

## 📋 Task Breakdown

### Task 1: Scraper Harness & Schema Engine
**Files:**
- Create: `The-Sound-of-Essentials-Eco-System/tools/nanobot_curator_scraper.py`
- Create: `The-Sound-of-Essentials-Eco-System/docs/soe_50_micro_curators_registry.json`

**Actions:**
- Build Python script that defines the 5 clusters, runs target discovery via Nanobot / search APIs, checks follower and engagement bounds, and writes clean records to `docs/soe_50_micro_curators_registry.json`.

---

### Task 2: Multi-Platform Scraping & Harvesting (50 Verified Creators)
**Execution:**
- **Run Phase 1 (Instagram)**: Query top hashtags in C1, C2, C4. Extract handles, follower counts, bios, email contacts, and 30-day average views.
- **Run Phase 2 (TikTok)**: Query C1, C4, C5. Extract creator handles, bio links, and sound-usage metrics.
- **Run Phase 3 (Pinterest)**: Query C2, C3. Extract high-repin early childhood educational curators and board owners.
- Target: Exactly 50 qualified records logged in the registry.

---

### Task 3: Outreach Customization & Seeding Kit Mapping
**Files:**
- Create: `The-Sound-of-Essentials-Eco-System/docs/soe_50_micro_curators_registry.md`

**Actions:**
- For each of the 50 harvested creators, automatically map:
  - Assigned Seeding Kit (`seed_kit_01` through `seed_kit_05`)
  - Personalized outreach DM copy with their handle and recent post reference
  - Pre-calculated offer: $45 single test / $150 3-post House Party pack
  - Dedicated UTM tracking link: `https://soelearn.com/listen?utm_source=curator_seeding&utm_medium=[PLATFORM]&utm_campaign=[HANDLE]`

---

### Task 4: Autonomous Nanobot Cron / Dispatch Integration
**Files:**
- Modify: `The-Sound-of-Essentials-Eco-System/tools/nanobot_social_autopilot.py`

**Actions:**
- Add `--curator-recon` mode to `nanobot_social_autopilot.py` to allow ongoing autonomous monitoring of new emerging micro-curators reaching the 15k follower threshold.

---

## 🚦 Execution Choice

Upon greenlight, execution proceeds immediately:
1. Run `tools/nanobot_curator_scraper.py` to populate the 50-curator registry.
2. Generate all 50 turnkey outreach packages in Markdown and JSON.
3. Verify zero regression across all Gate 1 checks.
