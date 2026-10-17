# SOE Market Campaign Launch System (SOE-MCLS) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy an automated, full-spectrum Meta marketing campaign launcher and growth engine for *The Sound of Essentials: Rhythm Quest* (`soelearn.com`), structured across 5 core operational pillars.

**Architecture:** A modular Python FastAPI backend (`tools/soe-mcls/`) orchestrating 5 core engines—Archetype Creative Forge, Direct Web Micro-Funnel with Stripe card vaulting, Meta Marketing API v21.0 Dispatcher, Dual CAPI + Brevo 18-Campaign Sync, and the Rhythm Guardian Auto-Scale/Kill Optimizer—interfacing with the React 19 / Vite web platform on `soelearn.com`.

**Tech Stack:** Python 3.11+, FastAPI, Pydantic v2, HTTPX, Stripe SDK (PaymentIntents + `setup_future_usage: off_session`), Meta Marketing API v21.0, Meta Conversions API (CAPI), Brevo API v3 (`info@soelearn.com`), APScheduler, React 19.2, Vite 7.2.

---

## 1. Full-Spectrum Deconstruction of the Autonomous Growth Engine Architecture

The Autonomous Meta Growth Engine operates as an AI-driven, mobile-first system designed to abstract away the technical friction of Meta Ads Manager, landing page design, and creative production. Instead of exposing hundreds of manual toggles, the engine utilizes a deterministic pipeline that takes an offering or product asset seed and automatically outputs high-converting creatives, deploys lightning-fast micro-funnels, dispatches multi-variant Meta campaigns via API, tracks conversions server-side, and dynamically reallocates ad spend toward winning creatives.

Here is the mechanical breakdown of the 5 Core Pillars:

### Pillar 1: AI Creative Studio (Static & Video Ad Generator)
* **Input Ingestion:** Ingests product metadata, core hooks, target customer profiles, and visual brand assets.
* **Script & Copy Engine:** Uses structured direct-response templates (Problem-Agitation-Solution, Us vs. Them, Emotional Ache + Tangible Proof + CTA) to generate ad scripts, primary copy, headlines, and link descriptions.
* **Visual & Video Assembly:**
  * *Static Creatives:* High-contrast visuals with dynamic headline overlays formatted across 1:1 (Feed), 4:5 (Mobile Feed), and 9:16 (Stories/Reels).
  * *Video Creatives:* UGC/B-roll sequences combined with background audio stems, punchy subtitles, and visual pattern interrupts in the first 3 seconds.

### Pillar 2: AI Landing Page & Micro-Funnel Engine
* **Architecture:** Mobile-first, single-purpose micro-funnels designed for sub-second load times to eliminate drop-off from Meta’s in-app browser.
* **Message Match:** Dynamically mirrors the exact hook, headline, and aesthetic of the originating Meta ad to maintain cognitive continuity.
* **Frictionless Checkout:** Embeds native payment capture (Apple Pay / Google Pay / Stripe Elements) directly on the view or via a 1-tap slide-out drawer without full-page reloads.

### Pillar 3: Meta Ads Launch Automation (Marketing API Engine)
* **API Abstraction:** Integrates directly with the Meta Marketing API (`act_<AD_ACCOUNT_ID>`) to bypass manual Ads Manager setup.
* **Campaign Structuring:** Automatically constructs a 3-tier hierarchy:
  * **Campaign Level:** Sets objective (`OUTCOME_SALES` or `OUTCOME_LEADS`), configures Advantage+ Campaign Budget (CBO) or Ad Set Budget (ABO).
  * **Ad Set Level:** Configures pixel conversion events, placement optimization, and translates buyer personas into Meta targeting specs (broad Advantage+ or interest clusters).
  * **Ad Level:** Bundles generated creative variants (3–5 visuals + 3 copy variants) using Dynamic Creative or Flexible Ad formats.

### Pillar 4: Real-Time Conversion, Attribution & CAPI Engine
* **Dual-Layer Tracking:** Pairs client-side Meta Pixel events with a server-side Conversions API (CAPI) pipeline to bypass iOS/browser tracking restrictions.
* **Event Deduplication:** Generates a deterministic `event_id` for every funnel action (`PageView`, `Lead`, `InitiateCheckout`, `Purchase`), hashing PII (`em`, `ph`, `fn`, `client_ip_address`, `client_user_agent`, `fbc`, `fbp`) via SHA-256 before dispatching to Meta and internal CRM.

### Pillar 5: Algorithmic Budget & Creative Optimization
* **Telemetry Polling:** Pulls performance metrics via the Meta Insights API (`spend`, `impressions`, `cpm`, `ctr`, `cpc`, `actions`, `cost_per_action_type`).
* **Rule-Based Guardrails:**
  * *Stop-Loss / Kill Switch:* If an ad spends > threshold (e.g., 1.5x target CPA) with zero conversions or a CTR < 0.8%, automatically sends a `PAUSED` mutation via the API.
  * *Winner Scaling:* If an ad maintains a CPA below target across N conversions, increases budget by 20% every 48 hours.
  * *Fatigue Detection:* Monitors frequency and 3-day rolling CTR decay; automatically rotates in fresh pre-generated creative variants from the staging queue.

---

## 2. Complete Translation for SOE (SOE-MCLS)

We are not building a generic SaaS for random businesses; we are building a dedicated, proprietary weapon for **The Sound of Essentials: Rhythm Quest**. Every growth mechanism is hard-coded to SOE’s canon, product ladder, and direct web stack (`soelearn.com`).

| Growth Pillar | SOE-MCLS Equivalent | SOE Specific Implementation & Canon Alignment |
| :--- | :--- | :--- |
| **1. AI Creative Studio** | **SOE Archetype & Asset Forge** | Hard-coded to the **5 Cultural Deltas** (*Screen vs. Sensory, Testing vs. Arts, Algorithm vs. Handcrafted, Institution vs. Sanctuary, Consumption vs. Quest*), the **6 Production Campaigns**, and the **30 Meta Ad Archetypes**. Enforces the **3-Layer Rule**:<br>1. *Emotional Identity / Parent Ache*<br>2. *Tangible Musical/Tactile Solution* (4,232 words, 400 activities, 19 songs)<br>3. *Frictionless Zero-Risk Invitation*.<br>Integrates **Gemini/Fal.ai** for warm, tactile visual generation + **Remotion/FFmpeg** to bind the actual 19-track album stems with kinetic typography in English, Spanish, and French. |
| **2. Micro-Funnel Engine** | **Direct Web Funnel Router (`soelearn.com`)** | Replaces generic templates with high-speed micro-routes on `soelearn.com` mapped to the originating Cultural Delta:<br>• **Step 1 (Front End):** `/listen` gate ($0 Free 19-Track Album capture).<br>• **Step 2 (In-Cart Bump):** $7 *Quest Starter Pack* (triggers Stripe `setup_future_usage: 'off_session'` to vault the card).<br>• **Step 3 (One-Click Upsells):** $19 *Interactive Ebook* $\rightarrow$ $21/$35 *Rhythm Ready Workbook* $\rightarrow$ $55/$79 *Essential Picture Dictionary* (or $89 *Full Quest Bundle*) + $14.99/mo *Rhythm Pass* continuity. |
| **3. Meta Launch Automation** | **One-Click Delta Dispatcher** | Automates deployment to Meta Marketing API v21.0. Select a Campaign (e.g., *The Enemy* or *Victory Garden*), choose a language (`EN`, `ES`, `FR`), choose buyer track (**D2C Parents/Caregivers** vs. **B2B ECE Directors/Preschools**), set daily budget, and click **Launch**. Automatically structures CBO campaigns with 3:2:2 creative testing arrays. |
| **4. CAPI & CRM Pipeline** | **SOE Attribution & Brevo Sync Engine** | Captures `/listen` leads and Stripe webhook events (`payment_intent.succeeded`). Simultaneously fires:<br>1. **Meta CAPI** (`Lead`, `InitiateCheckout`, `Purchase` with exact LTV/cart values and `fbc`/`fbp` cookies).<br>2. **Brevo API v3** (`info@soelearn.com`), routing the contact into the exact segment across the **18-campaign catalog** (6 D2C nurture sequences or 12 B2B outreach sequences) tagged with the exact Cultural Delta that acquired them. |
| **5. Algorithmic Optimizer** | **Rhythm Guardian (Auto-Scale & Kill)** | Automated cron daemon evaluating ad performance against SOE unit economics:<br>• **Target `/listen` Lead CPA:** $\le \$2.50$<br>• **Target $7 Starter Pack Take-Rate:** $\ge 15\%$<br>• **Target Blended Front-End ROAS:** $\ge 1.2\text{x}$ (breakeven before continuity/back-end).<br>Auto-pauses fatiguing archetypes and scales winning Cultural Deltas. |

---

## 2.5 Battle-Tested 2026 Intelligence Injection: 4 Critical Upgrades

Extracted from real-world scaling intelligence ($5.4M revenue / $811k ad spend across 2023–2026 multi-funnel shifts):

### Upgrade 1: Tandem Dual-Engine Funnel Architecture
Leading solely with a free value asset (like our `/listen` Free Album) stretches the average click-to-purchase window to 59–92 days. To maintain daily cash flow while compounding our audience lake, SOE-MCLS deploys **Two Funnels in Tandem**:
1. **Engine A (70% Budget) — The Value Asset Gate (`/listen`):** Free 19-Track Album + Coloring Book. 3–4% CTR, 35–40% opt-in, low CPL ($\le \$2.50$), captures mass volume into the Brevo nurture ecosystem.
2. **Engine B (20% Budget) — The Direct Tactile Showcase (`/shop`):** Straight to a video-rich showcase of the $35 Print Workbook and $55 Picture Dictionary with strong risk reversal (*30-Day Kitchen-Table Rhythm Guarantee*). Delivers immediate front-end cash flow.
3. **Engine C (10% Budget) — Advantage+ Retargeting Sweeper:** Broad retargeting over the 14-to-90-day trust horizon, re-engaging `/listen` streamers and ad engagers.

### Upgrade 2: 2-Step Progressive Friction Opt-In Form (+15–20% Lead Lift)
Decoupling the `/listen` capture modal into a 2-step progressive commitment:
- **Step 1 (Zero Friction):** Parent First Name + Best Email $\rightarrow$ instantly unlocks the web streaming player and fires CAPI `Lead` (securing 100% of top-of-funnel prospects).
- **Step 2 (Personalization & VIP Drop):** Child Age Bracket (`Ages 2–3`, `Ages 4–5`, `Ages 6–7`, `Educator`) + Mobile Number for text activity sheets $\rightarrow$ updates Brevo with age segmentation. Captures the extra 15–20% of cautious parents who would have abandoned a 1-step form.

### Upgrade 3: 90-Day Dual-Horizon Attribution Guardrail (Curing Meta 7-Day Blindness)
Meta Ads Manager's default 7-day click attribution window misses 35%+ of purchases when dealing with educational assets with extended consumption cycles (15 $\rightarrow$ 59 $\rightarrow$ 92 days).
- **Engine A Ads** are evaluated by `Rhythm Guardian` on **Cost Per Engaged Listener ($\le \$2.50$)** and **30/60/90-Day Cohort LTV**, NOT 7-day book purchase ROAS.
- A **First-Touch Attribution Ledger** binds the originating `first_touch_ad_id` to the lead in Brevo and the local database, crediting back-end book purchases back to the original top-of-funnel creative.

### Upgrade 4: Daily "Sanctuary Dispatch" Publishing Cadence
Supplementing the initial 5-day onboarding with a continuous daily micro-story email (150–250 words, plain-text feel, relatable parenting friction, rhythm shift, soft link to physical books) to convert older leads throughout days 15–90.

---

## 3. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                        SOE-MCLS COMMAND DASHBOARD (React/Vite)                    |
|  [Archetype Studio]  [Funnel Builder]  [1-Click Meta Launcher]  [ROAS/CAPI Live]  |
+-----------------------------------------+-----------------------------------------+
                                          | REST / WebSockets
                                          v
+-----------------------------------------------------------------------------------+
|                        SOE-MCLS CORE API ENGINE (FastAPI / Python)                |
|                                                                                   |
|  +------------------+  +-------------------+  +----------------+  +------------+  |
|  | Creative Engine  |  | Meta API Service  |  | Funnel & Stripe|  | Optimizer  |  |
|  | (Gemini + Fal +  |  | (v21.0 Graph API  |  | Vault Service  |  | Daemon     |  |
|  |  FFmpeg Audio)   |  |  Campaign/AdSet)  |  | (Off-Session)  |  | (APSched.) |  |
|  +--------+---------+  +---------+---------+  +-------+--------+  +-----+------+  |
+-----------|----------------------|--------------------|-----------------|---------+
            |                      |                    |                 |
            v                      v                    v                 v
   +----------------+     +----------------+   +----------------+  +-------------+
   | Fal.ai / Gemini|     | Meta Marketing |   | Stripe API +   |  | SQLite/     |
   | + 19 Audio     |     | API + CAPI     |   | Brevo CRM API  |  | PostgreSQL  |
   | Master Tracks  |     | Endpoint       |   | (18 Campaigns) |  | State DB    |
   +----------------+     +----------------+   +----------------+  +-------------+
```

---

## 4. Implementation Tasks

### Task 1: Project Scaffolding, Environment Configuration & Canonical Catalog

**Files:**
- Create: `tools/soe-mcls/__init__.py`
- Create: `tools/soe-mcls/config.py`
- Create: `tools/soe-mcls/canon.py`
- Create: `tools/soe-mcls/requirements.txt`
- Create: `tools/soe-mcls/tests/test_canon.py`

- [ ] **Step 1: Write the failing test for SOE Canonical Product Ladder & Archetype Validation**

Create `tools/soe-mcls/tests/test_canon.py`:
```python
import pytest
from soe_mcls.canon import (
    PRODUCT_LADDER,
    CULTURAL_DELTAS,
    PRODUCTION_CAMPAIGNS,
    validate_three_layer_ad,
)

def test_product_ladder_pricing_and_skus():
    assert PRODUCT_LADDER["FREE_ALBUM"]["price_cents"] == 0
    assert PRODUCT_LADDER["STARTER_PACK"]["price_cents"] == 700
    assert PRODUCT_LADDER["STARTER_PACK"]["vaults_card"] is True
    assert PRODUCT_LADDER["EBOOK_TRIPWIRE"]["price_cents"] == 1900
    assert PRODUCT_LADDER["WORKBOOK_DIGITAL"]["price_cents"] == 2100
    assert PRODUCT_LADDER["WORKBOOK_PRINT"]["price_cents"] == 3500
    assert PRODUCT_LADDER["DICTIONARY_DIGITAL"]["price_cents"] == 5500
    assert PRODUCT_LADDER["DICTIONARY_PRINT"]["price_cents"] == 7900
    assert PRODUCT_LADDER["FULL_BUNDLE"]["price_cents"] == 8900
    assert PRODUCT_LADDER["RHYTHM_PASS"]["price_cents"] == 1499
    assert PRODUCT_LADDER["RHYTHM_PASS"]["is_continuity"] is True

def test_cultural_deltas_and_campaigns_count():
    assert len(CULTURAL_DELTAS) == 5
    assert len(PRODUCTION_CAMPAIGNS) == 6

def test_three_layer_ad_validation():
    valid_ad = {
        "layer_1_ache": "Tired of watching algorithms hijack your toddler's nervous system?",
        "layer_2_solution": "Replace screen zombie time with 19 handcrafted songs and 400 tactile activities.",
        "layer_3_invitation": "Stream the 19-track Rhythm Quest album free today at soelearn.com/listen."
    }
    assert validate_three_layer_ad(valid_ad) is True

    invalid_ad = {"layer_1_ache": "Buy now", "layer_2_solution": "", "layer_3_invitation": "Click"}
    with pytest.raises(ValueError, match="violates the SOE 3-Layer Rule"):
        validate_three_layer_ad(invalid_ad)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tools/soe-mcls/tests/test_canon.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'soe_mcls'`

- [ ] **Step 3: Write minimal implementation of `requirements.txt`, `config.py`, and `canon.py`**

Create `tools/soe-mcls/requirements.txt`:
```text
fastapi>=0.115.0
uvicorn>=0.30.0
pydantic>=2.9.0
pydantic-settings>=2.5.0
httpx>=0.27.0
stripe>=10.12.0
pytest>=8.3.0
pytest-asyncio>=0.24.0
apscheduler>=3.10.4
```

Create `tools/soe-mcls/config.py`:
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SOE Market Campaign Launch System"
    BASE_DOMAIN: str = "https://soelearn.com"
    
    # Meta API
    META_ACCESS_TOKEN: str = "mock_meta_token"
    META_AD_ACCOUNT_ID: str = "act_000000000"
    META_PIXEL_ID: str = "000000000000"
    META_PAGE_ID: str = "000000000000"
    META_API_VERSION: str = "v21.0"
    
    # Stripe
    STRIPE_SECRET_KEY: str = "sk_test_mock"
    STRIPE_WEBHOOK_SECRET: str = "whsec_mock"
    
    # Brevo CRM
    BREVO_API_KEY: str = "xkeysib-mock"
    BREVO_SENDER_EMAIL: str = "info@soelearn.com"
    BREVO_SENDER_NAME: str = "The Sound of Essentials"
    
    # AI Creative Providers
    GEMINI_API_KEY: str = "mock_gemini_key"
    FAL_KEY: str = "mock_fal_key"

    class Config:
        env_file = ".env"

settings = Settings()
```

Create `tools/soe-mcls/canon.py`:
```python
from typing import Dict, Any

CULTURAL_DELTAS = {
    "SCREEN_VS_SENSORY": "Screen vs. Sensory",
    "TESTING_VS_ARTS": "Testing vs. Arts",
    "ALGORITHM_VS_HANDCRAFTED": "Algorithm vs. Handcrafted",
    "INSTITUTION_VS_SANCTUARY": "Institution vs. Sanctuary",
    "CONSUMPTION_VS_QUEST": "Consumption vs. Quest",
}

PRODUCTION_CAMPAIGNS = {
    "THE_ENEMY": "The Enemy",
    "WHAT_THEY_TOOK": "What They Took",
    "THE_ORIGIN_STORY": "The Origin Story",
    "THE_OTHER_SIDE": "The Other Side",
    "THE_NAME_TELLS_YOU": "The Name Tells You Everything",
    "VICTORY_GARDEN": "Victory Garden",
}

PRODUCT_LADDER: Dict[str, Dict[str, Any]] = {
    "FREE_ALBUM": {
        "sku": "soe_free_19_album",
        "name": "Free 19-Track Rhythm Quest Album",
        "price_cents": 0,
        "route": "/listen",
        "vaults_card": False,
        "is_continuity": False,
    },
    "STARTER_PACK": {
        "sku": "soe_quest_starter_7",
        "name": "Quest Starter Pack (In-Cart Bump)",
        "price_cents": 700,
        "vaults_card": True,
        "is_continuity": False,
    },
    "EBOOK_TRIPWIRE": {
        "sku": "soe_interactive_ebook_19",
        "name": "Rhythm Quest Interactive Ebook / PDF",
        "price_cents": 1900,
        "vaults_card": True,
        "is_continuity": False,
    },
    "WORKBOOK_DIGITAL": {
        "sku": "soe_workbook_dig_21",
        "name": "Rhythm Ready / Summer Stretch Workbook (Digital)",
        "price_cents": 2100,
        "vaults_card": True,
        "is_continuity": False,
    },
    "WORKBOOK_PRINT": {
        "sku": "soe_workbook_prt_35",
        "name": "Rhythm Ready / Summer Stretch Workbook (Print)",
        "price_cents": 3500,
        "vaults_card": True,
        "is_continuity": False,
    },
    "DICTIONARY_DIGITAL": {
        "sku": "soe_dict_dig_55",
        "name": "Essential Picture Dictionary (Digital - 4,232 Words, 157 Scenes)",
        "price_cents": 5500,
        "vaults_card": True,
        "is_continuity": False,
    },
    "DICTIONARY_PRINT": {
        "sku": "soe_dict_prt_79",
        "name": "Essential Picture Dictionary (Print - 4,232 Words, 157 Scenes)",
        "price_cents": 7900,
        "vaults_card": True,
        "is_continuity": False,
    },
    "FULL_BUNDLE": {
        "sku": "soe_bundle_dig_89",
        "name": "Digital Full Quest Bundle",
        "price_cents": 8900,
        "vaults_card": True,
        "is_continuity": False,
    },
    "RHYTHM_PASS": {
        "sku": "soe_rhythm_pass_1499",
        "name": "Rhythm Pass Monthly Continuity",
        "price_cents": 1499,
        "vaults_card": True,
        "is_continuity": True,
    },
}

BREVO_CAMPAIGN_MAP = {
    "D2C": {
        "screen_vs_sensory": 101,
        "testing_vs_arts": 102,
        "algorithm_vs_handcrafted": 103,
        "institution_vs_sanctuary": 104,
        "consumption_vs_quest": 105,
        "starter_pack_buyer": 106,
    },
    "B2B": {f"b2b_sequence_{i}": 200 + i for i in range(1, 13)},
}

def validate_three_layer_ad(ad_layers: Dict[str, str]) -> bool:
    required_keys = ["layer_1_ache", "layer_2_solution", "layer_3_invitation"]
    for key in required_keys:
        val = ad_layers.get(key, "").strip()
        if len(val) < 15:
            raise ValueError(f"Ad copy missing or too short on {key}: violates the SOE 3-Layer Rule.")
    return True
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tools/soe-mcls/tests/test_canon.py -v`
Expected: PASS (3 passed)

- [ ] **Step 5: Commit**

```bash
git add tools/soe-mcls/
git commit -m "feat(mcls): scaffold configuration, environment settings, and SOE canon"
```

---

### Task 2: Pillar 1 — SOE Archetype & Creative Forge (3-Layer Copy + Visual/Video Builder)

**Files:**
- Create: `tools/soe-mcls/creative_forge.py`
- Create: `tools/soe-mcls/tests/test_creative_forge.py`

- [ ] **Step 1: Write the failing test for the Creative Forge**

Create `tools/soe-mcls/tests/test_creative_forge.py`:
```python
import pytest
from soe_mcls.creative_forge import CreativeForge

def test_generate_ad_package_enforces_canon():
    forge = CreativeForge()
    package = forge.build_ad_variant(
        archetype_id="ARC-01",
        delta="SCREEN_VS_SENSORY",
        campaign="THE_ENEMY",
        language="en",
        buyer_track="D2C"
    )
    assert package["archetype_id"] == "ARC-01"
    assert "soelearn.com/listen" in package["destination_url"]
    assert "utm_campaign=the_enemy" in package["destination_url"]
    assert "utm_content=ARC-01" in package["destination_url"]
    assert len(package["primary_text"].split("\n\n")) == 3  # 3-Layer Rule paragraphs
    assert "warm" in package["visual_prompt"].lower() or "tactile" in package["visual_prompt"].lower()

def test_multilingual_generation():
    forge = CreativeForge()
    pkg_es = forge.build_ad_variant("ARC-02", "ALGORITHM_VS_HANDCRAFTED", "VICTORY_GARDEN", language="es")
    pkg_fr = forge.build_ad_variant("ARC-02", "ALGORITHM_VS_HANDCRAFTED", "VICTORY_GARDEN", language="fr")
    assert "Escucha" in pkg_es["headline"] or "Gratis" in pkg_es["headline"]
    assert "Écoutez" in pkg_fr["headline"] or "Gratuit" in pkg_fr["headline"]
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tools/soe-mcls/tests/test_creative_forge.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'soe_mcls.creative_forge'`

- [ ] **Step 3: Implement `tools/soe-mcls/creative_forge.py`**

Create `tools/soe-mcls/creative_forge.py`:
```python
from typing import Dict, Any
from soe_mcls.canon import CULTURAL_DELTAS, PRODUCTION_CAMPAIGNS, validate_three_layer_ad
from soe_mcls.config import settings

MULTILINGUAL_TEMPLATES = {
    "en": {
        "SCREEN_VS_SENSORY": {
            "layer_1_ache": "You can see it in their eyes after twenty minutes of algorithmic cartoons—that glazed, overstimulated restlessness that steals the peace right out of your living room.",
            "layer_2_solution": "Built with a father's heart and a mother's love, The Sound of Essentials replaces screen rot with 19 handcrafted songs, 4,232 illustrated words, and 400 tactile daily quests for ages 2–7.",
            "layer_3_invitation": "Press play on a calmer home tonight. Unlock all 19 tracks of the Rhythm Quest album 100% free—no app downloads, no algorithms.",
            "headline": "Stream the Free 19-Track Rhythm Quest Album",
        },
        "ALGORITHM_VS_HANDCRAFTED": {
            "layer_1_ache": "Silicon Valley engineered their apps to harvest your child's attention span before they even learn to tie their shoes.",
            "layer_2_solution": "Give them something real to hold, sing, and master: an 8-week musical quest packed with rhythm blocks, sensory movement, and timeless vocabulary.",
            "layer_3_invitation": "Start with the music. Claim the complete 19-song Rhythm Quest album free right now.",
            "headline": "Handcrafted Music for Ages 2–7 (Free Album)",
        }
    },
    "es": {
        "ALGORITHM_VS_HANDCRAFTED": {
            "layer_1_ache": "Los algoritmos fueron diseñados para capturar la atención de tu hijo antes de que aprenda a leer.",
            "layer_2_solution": "Creado con el corazón de un padre y el amor de una madre: 19 canciones artesanales, 4,232 palabras ilustradas y 400 actividades táctiles sin pantallas.",
            "layer_3_invitation": "Empieza hoy sin costo. Escucha el álbum completo de 19 canciones de Rhythm Quest totalmente gratis.",
            "headline": "Escucha el Álbum Gratis de 19 Canciones",
        }
    },
    "fr": {
        "ALGORITHM_VS_HANDCRAFTED": {
            "layer_1_ache": "Les algorithmes sont conçus pour capter l'attention de votre enfant avant même qu'il ne sache lire.",
            "layer_2_solution": "Créé avec le cœur d'un père et l'amour d'une mère : 19 chansons artisanales, 4 232 mots illustrés et 400 activités tactiles sans écran.",
            "layer_3_invitation": "Commencez gratuitement aujourd'hui. Écoutez l'album complet de 19 chansons Rhythm Quest sans aucun risque.",
            "headline": "Écoutez l'Album Gratuit de 19 Chansons",
        }
    }
}

class CreativeForge:
    """MCLS Pillar 1: Archetype & Asset Forge (3-Layer Copy + Visual/Video Specs)."""

    def build_ad_variant(
        self,
        archetype_id: str,
        delta: str,
        campaign: str,
        language: str = "en",
        buyer_track: str = "D2C",
        audio_track_number: int = 1,
    ) -> Dict[str, Any]:
        if delta not in CULTURAL_DELTAS:
            raise ValueError(f"Unknown Cultural Delta: {delta}")
        if campaign not in PRODUCTION_CAMPAIGNS:
            raise ValueError(f"Unknown Production Campaign: {campaign}")

        lang_dict = MULTILINGUAL_TEMPLATES.get(language, MULTILINGUAL_TEMPLATES["en"])
        copy_block = lang_dict.get(delta, MULTILINGUAL_TEMPLATES["en"]["SCREEN_VS_SENSORY"])

        validate_three_layer_ad(copy_block)

        primary_text = (
            f"{copy_block['layer_1_ache']}\n\n"
            f"{copy_block['layer_2_solution']}\n\n"
            f"{copy_block['layer_3_invitation']}"
        )

        campaign_slug = campaign.lower()
        delta_slug = delta.lower()
        destination_url = (
            f"{settings.BASE_DOMAIN}/listen"
            f"?utm_source=meta&utm_medium=paid_social"
            f"&utm_campaign={campaign_slug}"
            f"&utm_term={delta_slug}"
            f"&utm_content={archetype_id}_{language}"
        )

        visual_prompt = (
            f"Warm, grounded, tactile editorial photograph in golden morning light. "
            f"A parent and a 4-year-old child sitting on a woven rug exploring an open illustrated picture dictionary "
            f"and clapping to music. Screen-free sanctuary aesthetic, Kodak Portra 400 film grain, "
            f"theme: {CULTURAL_DELTAS[delta]}, campaign: {PRODUCTION_CAMPAIGNS[campaign]}."
        )

        return {
            "archetype_id": archetype_id,
            "delta": delta,
            "campaign": campaign,
            "language": language,
            "buyer_track": buyer_track,
            "primary_text": primary_text,
            "headline": copy_block["headline"],
            "layers": copy_block,
            "destination_url": destination_url,
            "visual_prompt": visual_prompt,
            "audio_track_number": audio_track_number,
            "call_to_action_type": "LISTEN_NOW" if buyer_track == "D2C" else "LEARN_MORE",
        }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tools/soe-mcls/tests/test_creative_forge.py -v`
Expected: PASS (2 passed)

- [ ] **Step 5: Commit**

```bash
git add tools/soe-mcls/creative_forge.py tools/soe-mcls/tests/test_creative_forge.py
git commit -m "feat(mcls): implement creative forge for 3-layer copy and multilingual specs"
```

---

### Task 3: Pillar 2 & 4 — Micro-Funnel Engine, Stripe Card Vaulting & CAPI/Brevo Sync

**Files:**
- Create: `tools/soe-mcls/funnel_engine.py`
- Create: `tools/soe-mcls/capi_brevo_sync.py`
- Create: `tools/soe-mcls/tests/test_funnel_and_sync.py`

- [ ] **Step 1: Write the failing test for `/listen` Lead Capture, $7 Starter Pack Card Vaulting, One-Click Upsell, and CAPI Hashing**

Create `tools/soe-mcls/tests/test_funnel_and_sync.py`:
```python
import pytest
from soe_mcls.funnel_engine import FunnelCheckoutService
from soe_mcls.capi_brevo_sync import TelemetrySyncEngine

def test_capi_payload_hashing_and_formatting():
    sync = TelemetrySyncEngine()
    payload = sync.build_meta_capi_payload(
        event_name="Lead",
        email="Parent@Example.com ",
        phone="+1 (555) 234-5678",
        event_id="evt_12345",
        source_url="https://soelearn.com/listen?utm_campaign=the_enemy",
        value_cents=0,
        fbc="fb.1.1558571054389.IwAR0",
        fbp="fb.1.1558571054389.1098115397"
    )
    event = payload["data"][0]
    assert event["event_name"] == "Lead"
    assert event["event_id"] == "evt_12345"
    assert len(event["user_data"]["em"][0]) == 64
    assert event["user_data"]["fbc"] == "fb.1.1558571054389.IwAR0"

def test_stripe_starter_pack_vault_intent_spec():
    service = FunnelCheckoutService(mock_mode=True)
    intent = service.create_vaulted_checkout_intent(
        email="mother@soelearn.com",
        sku_key="STARTER_PACK",
        delta="screen_vs_sensory"
    )
    assert intent["amount"] == 700
    assert intent["currency"] == "usd"
    assert intent["setup_future_usage"] == "off_session"
    assert intent["metadata"]["sku"] == "soe_quest_starter_7"

def test_one_click_off_session_upsell():
    service = FunnelCheckoutService(mock_mode=True)
    charge = service.charge_vaulted_upsell(
        customer_id="cus_mock123",
        payment_method_id="pm_mock123",
        sku_key="WORKBOOK_PRINT"
    )
    assert charge["amount"] == 3500
    assert charge["off_session"] is True
    assert charge["confirm"] is True
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tools/soe-mcls/tests/test_funnel_and_sync.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'soe_mcls.funnel_engine'`

- [ ] **Step 3: Implement `tools/soe-mcls/capi_brevo_sync.py` and `tools/soe-mcls/funnel_engine.py`**

Create `tools/soe-mcls/capi_brevo_sync.py`:
```python
import hashlib
import re
import time
from typing import Optional, Dict, Any
import httpx
from soe_mcls.config import settings
from soe_mcls.canon import BREVO_CAMPAIGN_MAP

class TelemetrySyncEngine:
    """MCLS Pillar 4: Server-Side Meta CAPI + Brevo 18-Campaign Router + First-Touch Ledger."""

    @staticmethod
    def _sha256_norm(value: str) -> str:
        cleaned = value.strip().lower()
        return hashlib.sha256(cleaned.encode("utf-8")).hexdigest()

    def build_meta_capi_payload(
        self,
        event_name: str,
        email: str,
        event_id: str,
        source_url: str,
        value_cents: int = 0,
        phone: Optional[str] = None,
        client_ip: Optional[str] = None,
        user_agent: Optional[str] = None,
        fbc: Optional[str] = None,
        fbp: Optional[str] = None,
    ) -> Dict[str, Any]:
        user_data: Dict[str, Any] = {
            "em": [self._sha256_norm(email)],
        }
        if phone:
            digits = re.sub(r"\D", "", phone)
            user_data["ph"] = [self._sha256_norm(digits)]
        if client_ip:
            user_data["client_ip_address"] = client_ip
        if user_agent:
            user_data["client_user_agent"] = user_agent
        if fbc:
            user_data["fbc"] = fbc
        if fbp:
            user_data["fbp"] = fbp

        event_payload: Dict[str, Any] = {
            "event_name": event_name,
            "event_time": int(time.time()),
            "event_id": event_id,
            "event_source_url": source_url,
            "action_source": "website",
            "user_data": user_data,
        }
        if value_cents > 0:
            event_payload["custom_data"] = {
                "currency": "USD",
                "value": round(value_cents / 100.0, 2),
            }

        return {"data": [event_payload]}

    async def dispatch_capi_event(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        url = f"https://graph.facebook.com/{settings.META_API_VERSION}/{settings.META_PIXEL_ID}/events"
        params = {"access_token": settings.META_ACCESS_TOKEN}
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, params=params, json=payload)
            return resp.json()

    def build_brevo_contact_payload(
        self,
        email: str,
        first_name: str,
        buyer_track: str,
        delta: str,
        purchased_skus: list[str],
    ) -> Dict[str, Any]:
        delta_key = delta.lower()
        if buyer_track == "D2C":
            list_id = BREVO_CAMPAIGN_MAP["D2C"].get(delta_key, 101)
        else:
            list_id = BREVO_CAMPAIGN_MAP["B2B"]["b2b_sequence_1"]

        return {
            "email": email.strip().lower(),
            "attributes": {
                "FIRSTNAME": first_name,
                "BUYER_TRACK": buyer_track,
                "CULTURAL_DELTA": delta_key,
                "PURCHASED_SKUS": ",".join(purchased_skus),
            },
            "listIds": [list_id],
            "updateEnabled": True,
        }
```

Create `tools/soe-mcls/funnel_engine.py`:
```python
import uuid
from typing import Dict, Any
import stripe
from soe_mcls.config import settings
from soe_mcls.canon import PRODUCT_LADDER

stripe.api_key = settings.STRIPE_SECRET_KEY

class FunnelCheckoutService:
    """MCLS Pillar 2: Direct Web Micro-Funnel & Stripe Card Vaulting."""

    def __init__(self, mock_mode: bool = False):
        self.mock_mode = mock_mode

    def create_vaulted_checkout_intent(
        self,
        email: str,
        sku_key: str,
        delta: str,
        campaign: str = "the_enemy",
    ) -> Dict[str, Any]:
        if sku_key not in PRODUCT_LADDER:
            raise ValueError(f"Invalid SKU key: {sku_key}")

        product = PRODUCT_LADDER[sku_key]
        intent_params: Dict[str, Any] = {
            "amount": product["price_cents"],
            "currency": "usd",
            "receipt_email": email,
            "metadata": {
                "sku": product["sku"],
                "sku_key": sku_key,
                "cultural_delta": delta,
                "campaign": campaign,
                "event_id": f"evt_{uuid.uuid4().hex[:12]}",
            },
        }
        if product["vaults_card"]:
            intent_params["setup_future_usage"] = "off_session"

        if self.mock_mode:
            return {
                "id": f"pi_mock_{uuid.uuid4().hex[:8]}",
                "client_secret": "pi_mock_secret_123",
                **intent_params,
            }

        customer = stripe.Customer.create(email=email, metadata={"cultural_delta": delta})
        intent_params["customer"] = customer.id
        intent = stripe.PaymentIntent.create(**intent_params)
        return dict(intent)

    def charge_vaulted_upsell(
        self,
        customer_id: str,
        payment_method_id: str,
        sku_key: str,
    ) -> Dict[str, Any]:
        if sku_key not in PRODUCT_LADDER:
            raise ValueError(f"Invalid SKU key: {sku_key}")

        product = PRODUCT_LADDER[sku_key]
        charge_params: Dict[str, Any] = {
            "amount": product["price_cents"],
            "currency": "usd",
            "customer": customer_id,
            "payment_method": payment_method_id,
            "off_session": True,
            "confirm": True,
            "metadata": {
                "sku": product["sku"],
                "upsell_one_click": "true",
            },
        }

        if self.mock_mode:
            return {"id": f"pi_upsell_{uuid.uuid4().hex[:8]}", "status": "succeeded", **charge_params}

        intent = stripe.PaymentIntent.create(**charge_params)
        return dict(intent)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tools/soe-mcls/tests/test_funnel_and_sync.py -v`
Expected: PASS (3 passed)

- [ ] **Step 5: Commit**

```bash
git add tools/soe-mcls/funnel_engine.py tools/soe-mcls/capi_brevo_sync.py tools/soe-mcls/tests/test_funnel_and_sync.py
git commit -m "feat(mcls): implement Stripe card vaulting and CAPI/Brevo synchronization"
```

---

### Task 4: Pillar 3 & 5 — Meta Marketing API Dispatcher & Rhythm Guardian Optimizer

**Files:**
- Create: `tools/soe-mcls/meta_launcher.py`
- Create: `tools/soe-mcls/rhythm_guardian.py`
- Create: `tools/soe-mcls/tests/test_meta_and_guardian.py`

- [ ] **Step 1: Write the failing test for Meta Campaign Dispatch & Algorithmic Optimization Rules**

Create `tools/soe-mcls/tests/test_meta_and_guardian.py`:
```python
import pytest
from soe_mcls.meta_launcher import MetaCampaignLauncher
from soe_mcls.rhythm_guardian import RhythmGuardianOptimizer

def test_meta_campaign_payload_structure():
    launcher = MetaCampaignLauncher(dry_run=True)
    bundle = launcher.prepare_full_campaign_launch(
        campaign_key="THE_ENEMY",
        delta_key="SCREEN_VS_SENSORY",
        daily_budget_cents=5000,
        buyer_track="D2C",
        language="en",
        archetype_ids=["ARC-01", "ARC-02", "ARC-03"]
    )
    assert bundle["campaign_spec"]["objective"] == "OUTCOME_SALES"
    assert bundle["campaign_spec"]["daily_budget"] == 5000
    assert len(bundle["ad_specs"]) == 3
    assert bundle["adset_spec"]["targeting"]["age_min"] == 24

def test_rhythm_guardian_kill_and_scale_decisions():
    guardian = RhythmGuardianOptimizer(
        max_lead_cpa_dollars=2.50,
        min_ctr_percent=0.8,
        min_spend_for_decision_dollars=10.0
    )
    metrics = [
        # Bleeding ad: spent $18, 0 leads, CTR 0.45% -> PAUSE
        {"ad_id": "ad_loser_1", "spend": 18.0, "leads": 0, "purchases": 0, "ctr": 0.45, "current_budget_cents": 3000},
        # Winning ad: spent $25, 15 leads ($1.66 CPA), 3 Starter Packs -> SCALE +20%
        {"ad_id": "ad_winner_1", "spend": 25.0, "leads": 15, "purchases": 3, "ctr": 2.10, "current_budget_cents": 5000},
        # Learning ad: spent $4, 0 leads -> HOLD
        {"ad_id": "ad_learning_1", "spend": 4.0, "leads": 0, "purchases": 0, "ctr": 1.10, "current_budget_cents": 3000},
    ]
    decisions = guardian.evaluate_ads(metrics)
    assert decisions["ad_loser_1"]["action"] == "PAUSE"
    assert decisions["ad_winner_1"]["action"] == "SCALE_BUDGET"
    assert decisions["ad_winner_1"]["new_budget_cents"] == 6000  # +20% of 5000
    assert decisions["ad_learning_1"]["action"] == "HOLD"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tools/soe-mcls/tests/test_meta_and_guardian.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'soe_mcls.meta_launcher'`

- [ ] **Step 3: Implement `tools/soe-mcls/meta_launcher.py` and `tools/soe-mcls/rhythm_guardian.py`**

Create `tools/soe-mcls/meta_launcher.py`:
```python
from typing import List, Dict, Any
from soe_mcls.config import settings
from soe_mcls.creative_forge import CreativeForge

class MetaCampaignLauncher:
    """MCLS Pillar 3: One-Click Meta Marketing API v21.0 Tandem Campaign Dispatcher."""

    def __init__(self, dry_run: bool = True):
        self.dry_run = dry_run
        self.forge = CreativeForge()

    def build_targeting_spec(self, buyer_track: str, language: str) -> Dict[str, Any]:
        locales_map = {"en": [6, 24], "es": [23], "fr": [9]}
        if buyer_track == "D2C":
            return {
                "geo_locations": {"countries": ["US", "CA"]},
                "age_min": 24,
                "age_max": 48,
                "locales": locales_map.get(language, [6]),
                "targeting_automation": {"advantage_audience": 1},
            }
        else:
            return {
                "geo_locations": {"countries": ["US"]},
                "age_min": 28,
                "age_max": 65,
                "targeting_automation": {"advantage_audience": 1},
            }

    def prepare_full_campaign_launch(
        self,
        campaign_key: str,
        delta_key: str,
        daily_budget_cents: int,
        buyer_track: str = "D2C",
        language: str = "en",
        archetype_ids: List[str] = None,
    ) -> Dict[str, Any]:
        archetype_ids = archetype_ids or ["ARC-01", "ARC-02", "ARC-03"]

        campaign_spec = {
            "name": f"SOE | {campaign_key} | {delta_key} | {buyer_track} | {language.upper()}",
            "objective": "OUTCOME_SALES",
            "status": "ACTIVE",
            "special_ad_categories": [],
            "daily_budget": daily_budget_cents,
            "bid_strategy": "LOWEST_COST_WITHOUT_CAP",
        }

        adset_spec = {
            "name": f"ADSET | {delta_key} | {buyer_track} ({language.upper()})",
            "optimization_goal": "OFFSITE_CONVERSIONS",
            "billing_event": "IMPRESSIONS",
            "promoted_object": {
                "pixel_id": settings.META_PIXEL_ID,
                "custom_event_type": "PURCHASE",
            },
            "targeting": self.build_targeting_spec(buyer_track, language),
            "status": "ACTIVE",
        }

        ad_specs = []
        for idx, arc_id in enumerate(archetype_ids, start=1):
            creative = self.forge.build_ad_variant(
                archetype_id=arc_id,
                delta=delta_key,
                campaign=campaign_key,
                language=language,
                buyer_track=buyer_track,
                audio_track_number=idx,
            )
            ad_specs.append({
                "name": f"AD | {arc_id} | {delta_key} | Track-{idx}",
                "status": "ACTIVE",
                "creative": {
                    "object_story_spec": {
                        "page_id": settings.META_PAGE_ID,
                        "link_data": {
                            "message": creative["primary_text"],
                            "link": creative["destination_url"],
                            "name": creative["headline"],
                            "call_to_action": {
                                "type": creative["call_to_action_type"],
                                "value": {"link": creative["destination_url"]},
                            },
                        },
                    }
                },
                "forge_metadata": creative,
            })

        return {
            "ad_account_id": settings.META_AD_ACCOUNT_ID,
            "campaign_spec": campaign_spec,
            "adset_spec": adset_spec,
            "ad_specs": ad_specs,
        }
```

Create `tools/soe-mcls/rhythm_guardian.py`:
```python
from typing import List, Dict, Any

class RhythmGuardianOptimizer:
    """MCLS Pillar 5: Automated Stop-Loss & Winner Scaling Engine."""

    def __init__(
        self,
        max_lead_cpa_dollars: float = 2.50,
        min_ctr_percent: float = 0.80,
        min_spend_for_decision_dollars: float = 10.0,
        scale_step_ratio: float = 1.20,
    ):
        self.max_lead_cpa = max_lead_cpa_dollars
        self.min_ctr = min_ctr_percent
        self.min_spend = min_spend_for_decision_dollars
        self.scale_step = scale_step_ratio

    def evaluate_ads(self, ad_metrics: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        decisions: Dict[str, Dict[str, Any]] = {}

        for row in ad_metrics:
            ad_id = row["ad_id"]
            spend = float(row.get("spend", 0.0))
            leads = int(row.get("leads", 0))
            purchases = int(row.get("purchases", 0))
            ctr = float(row.get("ctr", 0.0))
            current_budget = int(row.get("current_budget_cents", 3000))

            if spend < self.min_spend:
                decisions[ad_id] = {
                    "action": "HOLD",
                    "reason": f"Spend (${spend:.2f}) below learning threshold (${self.min_spend:.2f}).",
                }
                continue

            lead_cpa = (spend / leads) if leads > 0 else 999.0

            if (leads == 0 and purchases == 0) or (lead_cpa > self.max_lead_cpa and ctr < self.min_ctr):
                decisions[ad_id] = {
                    "action": "PAUSE",
                    "reason": f"Stop-Loss triggered: Spend=${spend:.2f}, Leads={leads}, CTR={ctr:.2f}%.",
                }
            elif (leads >= 5 and lead_cpa <= self.max_lead_cpa) or purchases >= 2:
                new_budget = int(round(current_budget * self.scale_step))
                decisions[ad_id] = {
                    "action": "SCALE_BUDGET",
                    "new_budget_cents": new_budget,
                    "reason": f"Winner detected: Lead CPA=${lead_cpa:.2f}, Purchases={purchases}. Scaling +20%.",
                }
            else:
                decisions[ad_id] = {
                    "action": "HOLD",
                    "reason": f"Within acceptable parameters (Lead CPA=${lead_cpa:.2f}, CTR={ctr:.2f}%).",
                }

        return decisions
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tools/soe-mcls/tests/test_meta_and_guardian.py -v`
Expected: PASS (2 passed)

- [ ] **Step 5: Commit**

```bash
git add tools/soe-mcls/meta_launcher.py tools/soe-mcls/rhythm_guardian.py tools/soe-mcls/tests/test_meta_and_guardian.py
git commit -m "feat(mcls): implement Meta Marketing API launcher and Rhythm Guardian optimizer"
```

---

### Task 5: Unified FastAPI Control Plane (`main.py`) & End-to-End Integration Verification

**Files:**
- Create: `tools/soe-mcls/main.py`
- Create: `tools/soe-mcls/tests/test_api_e2e.py`

- [ ] **Step 1: Write the failing end-to-end API test**

Create `tools/soe-mcls/tests/test_api_e2e.py`:
```python
from fastapi.testclient import TestClient
from soe_mcls.main import app

client = TestClient(app)

def test_one_click_campaign_launch_endpoint():
    resp = client.post("/api/v1/campaigns/launch", json={
        "campaign_key": "VICTORY_GARDEN",
        "delta_key": "ALGORITHM_VS_HANDCRAFTED",
        "daily_budget_cents": 4500,
        "buyer_track": "D2C",
        "language": "en",
        "archetype_ids": ["ARC-01", "ARC-07"]
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "READY_TO_DISPATCH"
    assert len(data["bundle"]["ad_specs"]) == 2

def test_listen_funnel_lead_and_starter_pack_bump():
    resp = client.post("/api/v1/funnel/listen-capture", json={
        "email": "caregiver@soelearn.com",
        "first_name": "Elena",
        "delta": "SCREEN_VS_SENSORY",
        "include_starter_pack_bump": True
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["capi_event"]["data"][0]["event_name"] == "InitiateCheckout"
    assert data["stripe_intent"]["amount"] == 700
    assert data["stripe_intent"]["setup_future_usage"] == "off_session"
    assert data["brevo_sync"]["listIds"] == [101]
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tools/soe-mcls/tests/test_api_e2e.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'soe_mcls.main'`

- [ ] **Step 3: Implement `tools/soe-mcls/main.py`**

Create `tools/soe-mcls/main.py`:
```python
import uuid
from typing import List, Optional
from fastapi import FastAPI
from pydantic import BaseModel
from soe_mcls.canon import PRODUCT_LADDER, CULTURAL_DELTAS, PRODUCTION_CAMPAIGNS
from soe_mcls.meta_launcher import MetaCampaignLauncher
from soe_mcls.funnel_engine import FunnelCheckoutService
from soe_mcls.capi_brevo_sync import TelemetrySyncEngine
from soe_mcls.rhythm_guardian import RhythmGuardianOptimizer

app = FastAPI(title="SOE Market Campaign Launch System (SOE-MCLS)", version="1.0.0")

launcher = MetaCampaignLauncher(dry_run=True)
funnel_service = FunnelCheckoutService(mock_mode=True)
sync_engine = TelemetrySyncEngine()
guardian = RhythmGuardianOptimizer()

class CampaignLaunchRequest(BaseModel):
    campaign_key: str
    delta_key: str
    daily_budget_cents: int = 5000
    buyer_track: str = "D2C"
    language: str = "en"
    archetype_ids: List[str] = ["ARC-01", "ARC-02", "ARC-03"]

class ListenCaptureRequest(BaseModel):
    email: str
    first_name: str
    delta: str = "SCREEN_VS_SENSORY"
    buyer_track: str = "D2C"
    include_starter_pack_bump: bool = False
    fbc: Optional[str] = None
    fbp: Optional[str] = None

@app.get("/api/v1/canon")
def get_canon_state():
    return {
        "deltas": CULTURAL_DELTAS,
        "campaigns": PRODUCTION_CAMPAIGNS,
        "product_ladder": PRODUCT_LADDER,
    }

@app.post("/api/v1/campaigns/launch")
def launch_meta_campaign(req: CampaignLaunchRequest):
    bundle = launcher.prepare_full_campaign_launch(
        campaign_key=req.campaign_key,
        delta_key=req.delta_key,
        daily_budget_cents=req.daily_budget_cents,
        buyer_track=req.buyer_track,
        language=req.language,
        archetype_ids=req.archetype_ids,
    )
    return {"status": "READY_TO_DISPATCH", "bundle": bundle}

@app.post("/api/v1/funnel/listen-capture")
def capture_listen_lead(req: ListenCaptureRequest):
    event_id = f"evt_{uuid.uuid4().hex[:12]}"
    event_name = "InitiateCheckout" if req.include_starter_pack_bump else "Lead"
    val_cents = 700 if req.include_starter_pack_bump else 0

    capi_payload = sync_engine.build_meta_capi_payload(
        event_name=event_name,
        email=req.email,
        event_id=event_id,
        source_url="https://soelearn.com/listen",
        value_cents=val_cents,
        fbc=req.fbc,
        fbp=req.fbp,
    )

    brevo_payload = sync_engine.build_brevo_contact_payload(
        email=req.email,
        first_name=req.first_name,
        buyer_track=req.buyer_track,
        delta=req.delta,
        purchased_skus=["soe_free_19_album"],
    )

    stripe_intent = None
    if req.include_starter_pack_bump:
        stripe_intent = funnel_service.create_vaulted_checkout_intent(
            email=req.email,
            sku_key="STARTER_PACK",
            delta=req.delta,
        )

    return {
        "status": "CAPTURED",
        "album_stream_unlocked": True,
        "capi_event": capi_payload,
        "brevo_sync": brevo_payload,
        "stripe_intent": stripe_intent,
    }
```

- [ ] **Step 4: Run the full test suite to verify all tasks pass**

Run: `python -m pytest tools/soe-mcls/tests -v`
Expected: PASS (10 passed across all 5 test modules)

- [ ] **Step 5: Commit**

```bash
git add tools/soe-mcls/main.py tools/soe-mcls/tests/test_api_e2e.py
git commit -m "feat(mcls): complete unified FastAPI control plane and e2e test suite"
```

---

## 5. Execution Handoff

Plan complete and saved to `docs/plans/2026-10-16-soe-market-campaign-launch-system.md`. Two execution options:

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration.
2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints.

Which approach?
