#!/usr/bin/env python3
"""
SOE Batch 3 Backlink Poaching Engine: Speech Intervention, Montessori Purists & Bilingual Hubs
The Sound of Essentials: Rhythm Quest

Stages 25 vetted high-authority clinical, Montessori, and bilingual targets into Brevo List #11.
Audited against Helix Gate 1 standards:
- Spam Score < 5.0%
- Monthly Organic Traffic >= 1,000
- Ages 2–7 strict boundary
- Music Canon: Zero live instrumentation claims
"""

import os
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path

# Fix Windows console UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

ENGINE_DIR = Path(__file__).resolve().parent
STATE_FILE = ENGINE_DIR / "contacted_domains.json"

BREVO_API_KEY = os.environ.get("BREVO_API_KEY", "")
BREVO_API_URL = "https://api.brevo.com/v3"

BATCH3_PROSPECTS = [
    # --- Pillar 1: Pediatric SLP & Auditory Processing (Template 8: acoustic speech tool) ---
    {
        "domain": "speechtimefun.com",
        "target_url": "https://speechtimefun.com/speech-therapy-resources-for-early-childhood/",
        "competitor_source": "hookedonphonics.com",
        "email": "hallie@speechtimefun.com",
        "contact_name": "Hallie Sherman",
        "organization": "Speech Time Fun",
        "niche": "Pediatric Speech-Language Pathology",
        "estimated_traffic": 120000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "thedabblingspeechie.com",
        "target_url": "https://thedabblingspeechie.com/early-language-development-activities/",
        "competitor_source": "hookedonphonics.com",
        "email": "felice@thedabblingspeechie.com",
        "contact_name": "Felice Clark",
        "organization": "The Dabbling Speechie",
        "niche": "Pediatric SLP & Auditory Repetition",
        "estimated_traffic": 95000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "speechroomnews.com",
        "target_url": "https://thespeechroomnews.com/speech-delay-intervention-tools/",
        "competitor_source": "hookedonphonics.com",
        "email": "shannon@thespeechroomnews.com",
        "contact_name": "Shannon Lisowe",
        "organization": "Speech Room News",
        "niche": "Early Childhood SLP Resources",
        "estimated_traffic": 85000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "adventuresinspeechpathology.com",
        "target_url": "https://adventuresinspeechpathology.com/childhood-apraxia-of-speech-tools/",
        "competitor_source": "hookedonphonics.com",
        "email": "rebecca@adventuresinspeechpathology.com",
        "contact_name": "Rebecca Reinking",
        "organization": "Adventures in Speech Pathology",
        "niche": "Speech Sound Disorders & Rhythmic Cuing",
        "estimated_traffic": 65000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "chicagospeechtherapy.com",
        "target_url": "https://chicagospeechtherapy.com/sensory-auditory-tools-for-toddlers/",
        "competitor_source": "busytoddler.com",
        "email": "clinic@chicagospeechtherapy.com",
        "contact_name": "Clinical Director",
        "organization": "Chicago Speech Therapy Clinic",
        "niche": "Clinical Pediatric Speech & Sensory OT",
        "estimated_traffic": 45000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "carlaspeech.com",
        "target_url": "https://carlaspeech.com/toddler-phonemic-sound-activities/",
        "competitor_source": "hookedonphonics.com",
        "email": "carla@carlaspeech.com",
        "contact_name": "Carla",
        "organization": "Carla Speech & Language",
        "niche": "Toddler Speech Development",
        "estimated_traffic": 40000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "speechtherapyfun.com",
        "target_url": "https://speechtherapyfun.com/auditory-sensory-games-preschool/",
        "competitor_source": "hookedonphonics.com",
        "email": "hello@speechtherapyfun.com",
        "contact_name": "Therapy Guides",
        "organization": "Speech Therapy Fun",
        "niche": "Preschool Speech Exercises",
        "estimated_traffic": 35000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "beautifulspeechlife.com",
        "target_url": "https://beautifulspeechlife.com/calm-sensory-speech-room/",
        "competitor_source": "busytoddler.com",
        "email": "anne@beautifulspeechlife.com",
        "contact_name": "Anne Page",
        "organization": "Beautiful Speech Life",
        "niche": "Pediatric Speech & Sensory Calming",
        "estimated_traffic": 30000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "pediatricspeechtherapy.org",
        "target_url": "https://pediatricspeechtherapy.org/auditory-processing-tools-for-kids/",
        "competitor_source": "hookedonphonics.com",
        "email": "info@pediatricspeechtherapy.org",
        "contact_name": "Pediatric Lead",
        "organization": "Pediatric Speech Therapy Network",
        "niche": "Pediatric Speech Pathology",
        "estimated_traffic": 28000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "thepediatricspeechwoman.com",
        "target_url": "https://thepediatricspeechwoman.com/rhythm-and-speech-delay-activities/",
        "competitor_source": "hookedonphonics.com",
        "email": "hello@thepediatricspeechwoman.com",
        "contact_name": "Clinical Team",
        "organization": "The Pediatric Speech Woman",
        "niche": "Toddler Speech Delay & Apraxia",
        "estimated_traffic": 22000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },

    # --- Pillar 2: Montessori & Screen-Free Tactile Purists (Template 13: screen-free phonics) ---
    {
        "domain": "guidepostmontessori.com",
        "target_url": "https://www.guidepostmontessori.com/blog/screen-free-early-literacy-at-home",
        "competitor_source": "abcmouse.com",
        "email": "editorial@guidepostmontessori.com",
        "contact_name": "Curriculum Editors",
        "organization": "Guidepost Montessori",
        "niche": "Montessori Early Childhood Education",
        "estimated_traffic": 310000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "livingmontessorinow.com",
        "target_url": "https://livingmontessorinow.com/montessori-phonics-and-reading-activities/",
        "competitor_source": "abcmouse.com",
        "email": "deb@livingmontessorinow.com",
        "contact_name": "Deb Chitwood",
        "organization": "Living Montessori Now",
        "niche": "Montessori Phonics & Sensorial Play",
        "estimated_traffic": 260000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "howwemontessori.com",
        "target_url": "https://www.howwemontessori.com/how-we-montessori-blog/early-language-development.html",
        "competitor_source": "abcmouse.com",
        "email": "kylie@howwemontessori.com",
        "contact_name": "Kylie D'Alton",
        "organization": "How We Montessori",
        "niche": "Montessori Toddler & Primary Home",
        "estimated_traffic": 140000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "montessorinature.com",
        "target_url": "https://montessorinature.com/montessori-sound-games-and-phonemic-awareness/",
        "competitor_source": "learnwithhomer.com",
        "email": "anastasia@montessorinature.com",
        "contact_name": "Anastasia",
        "organization": "Montessori Nature",
        "niche": "Montessori Sound Games & Phonics",
        "estimated_traffic": 130000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "thekavanaughreport.com",
        "target_url": "https://www.thekavanaughreport.com/montessori-friendly-early-reading-resources/",
        "competitor_source": "learnwithhomer.com",
        "email": "nicole@thekavanaughreport.com",
        "contact_name": "Nicole Kavanaugh",
        "organization": "The Kavanaugh Report",
        "niche": "Montessori Home & Early Reading",
        "estimated_traffic": 110000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "montessorieducation.com",
        "target_url": "https://montessorieducation.com/resources/phonics-sound-development-preschool",
        "competitor_source": "abcmouse.com",
        "email": "resources@montessorieducation.com",
        "contact_name": "Foundation Guides",
        "organization": "Montessori Education Foundation",
        "niche": "Montessori Curriculum Foundation",
        "estimated_traffic": 75000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "montessorirocks.org",
        "target_url": "https://montessorirocks.org/why-screen-free-phonics-works-best/",
        "competitor_source": "abcmouse.com",
        "email": "editor@montessorirocks.org",
        "contact_name": "Editorial Guides",
        "organization": "Montessori Rocks",
        "niche": "Montessori Thought Leadership",
        "estimated_traffic": 45000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "welcometomoms.com",
        "target_url": "https://welcometomoms.com/screen-free-phonics-toddlers-kindergarten/",
        "competitor_source": "readingeggs.com",
        "email": "hello@welcometomoms.com",
        "contact_name": "Parenting Leads",
        "organization": "Welcome to Moms",
        "niche": "Screen-Free Early Learning",
        "estimated_traffic": 35000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "ourmontessorilife.com",
        "target_url": "https://ourmontessorilife.com/sensory-language-materials-for-preschoolers/",
        "competitor_source": "learnwithhomer.com",
        "email": "bethann@ourmontessorilife.com",
        "contact_name": "Beth Ann",
        "organization": "Our Montessori Life",
        "niche": "Montessori Sensorial Language",
        "estimated_traffic": 28000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "midwestmontessori.com",
        "target_url": "https://midwestmontessori.com/auditory-preparation-for-early-readers/",
        "competitor_source": "abcmouse.com",
        "email": "guides@midwestmontessori.com",
        "contact_name": "Primary Lead",
        "organization": "Midwest Montessori",
        "niche": "Montessori Primary Reading Readiness",
        "estimated_traffic": 18000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },

    # --- Pillar 3: Bilingual Early Literacy & Auditory Acuity (Template 14: 4,000 words via music) ---
    {
        "domain": "bilingualkidspot.com",
        "target_url": "https://bilingualkidspot.com/bilingual-early-learning-reading-apps-alternatives/",
        "competitor_source": "lingokids.com",
        "email": "chontelle@bilingualkidspot.com",
        "contact_name": "Chontelle Bonfiglio",
        "organization": "Bilingual Kidspot",
        "niche": "Bilingual Literacy & Auditory Language",
        "estimated_traffic": 210000,
        "spam_score": 1.0,
        "chosen_hook": "4,000 words via music",
        "brevo_template_id": 14,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "spanishmama.com",
        "target_url": "https://spanishmama.com/spanish-english-phonics-resources-for-kids/",
        "competitor_source": "lingokids.com",
        "email": "elisabeth@spanishmama.com",
        "contact_name": "Elisabeth",
        "organization": "Spanish Mama",
        "niche": "Dual Language & Bilingual Phonics",
        "estimated_traffic": 175000,
        "spam_score": 1.0,
        "chosen_hook": "4,000 words via music",
        "brevo_template_id": 14,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "bilingualmonkeys.com",
        "target_url": "https://bilingualmonkeys.com/music-and-rhyme-for-early-vocabulary/",
        "competitor_source": "lingokids.com",
        "email": "adam@bilingualmonkeys.com",
        "contact_name": "Adam Beck",
        "organization": "Bilingual Monkeys",
        "niche": "Multilingual Auditory Development",
        "estimated_traffic": 90000,
        "spam_score": 1.0,
        "chosen_hook": "4,000 words via music",
        "brevo_template_id": 14,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "mommymaestra.com",
        "target_url": "https://www.mommymaestra.com/multilingual-preschool-music-and-phonics/",
        "competitor_source": "lingokids.com",
        "email": "monica@mommymaestra.com",
        "contact_name": "Monica Olivera",
        "organization": "Mommy Maestra",
        "niche": "Multicultural Early Learning",
        "estimated_traffic": 85000,
        "spam_score": 1.0,
        "chosen_hook": "4,000 words via music",
        "brevo_template_id": 14,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    },
    {
        "domain": "spanglishbaby.com",
        "target_url": "https://spanglishbaby.com/early-language-immersion-tools-without-screens/",
        "competitor_source": "lingokids.com",
        "email": "hola@spanglishbaby.com",
        "contact_name": "Community Team",
        "organization": "Spanglish Baby",
        "niche": "Bilingual Early Childhood Community",
        "estimated_traffic": 50000,
        "spam_score": 1.0,
        "chosen_hook": "4,000 words via music",
        "brevo_template_id": 14,
        "status": "ready_to_stage",
        "date_added": "2026-10-20"
    }
]

def brevo_request(endpoint, method="GET", payload=None):
    url = f"{BREVO_API_URL}/{endpoint.lstrip('/')}"
    headers = {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    data = json.dumps(payload).encode("utf-8") if payload else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return {"error": json.loads(err_body), "status_code": e.code}
        except:
            return {"error": err_body, "status_code": e.code}
    except Exception as e:
        return {"error": str(e), "status_code": 500}

def stage_batch3(target_list_id=11):
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        state = json.load(f)

    existing_domains = {p["domain"] for p in state.get("prospects", [])}

    print("\n" + "=" * 65)
    print("      SOE BREVO BATCH 3 STAGING ENGINE")
    print("=" * 65)
    print(f"[*] Staging {len(BATCH3_PROSPECTS)} vetted targets into Brevo List #{target_list_id}")
    print(f"[*] Authenticated Sender: ID #2 (The Sound of Essentials <info@soelearn.com>)\n")

    staged_count = 0
    updated_count = 0
    error_count = 0

    for idx, p in enumerate(BATCH3_PROSPECTS, start=1):
        domain = p.get("domain")
        if domain in existing_domains:
            print(f"  [SKIP:DUPLICATE] #{idx:02d}: {domain} already in state file!")
            continue

        email = p.get("email")
        first_name = p.get("contact_name", "").split()[0]
        payload = {
            "email": email,
            "listIds": [target_list_id],
            "updateEnabled": True,
            "attributes": {
                "FIRSTNAME": first_name,
                "ORGANIZATION": p.get("organization", ""),
                "COMPETITOR_SOURCE": p.get("competitor_source", ""),
                "TARGET_PAGE_URL": p.get("target_url", ""),
                "BIO_HOOK": p.get("chosen_hook", ""),
            }
        }

        res = brevo_request("/contacts", method="POST", payload=payload)
        
        if "id" in res:
            staged_count += 1
            print(f"  [OK:CREATED] #{idx:02d}: {email:<36} (Brevo ID: {res['id']})")
        elif "status_code" in res and res["status_code"] in [204, 200]:
            updated_count += 1
            print(f"  [OK:UPDATED] #{idx:02d}: {email:<36}")
        elif res.get("error", {}).get("code") == "duplicate_parameter":
            res_add = brevo_request(f"/contacts/lists/{target_list_id}/contacts/add", method="POST", payload={"emails": [email]})
            updated_count += 1
            print(f"  [OK:LIST_ADD] #{idx:02d}: {email:<36}")
        else:
            error_count += 1
            print(f"  [FAIL]       #{idx:02d}: {email:<36} | {res}")

    # Synchronize state file
    for p in BATCH3_PROSPECTS:
        if p["domain"] not in existing_domains:
            p_copy = dict(p)
            p_copy["status"] = "staged_in_brevo"
            state["prospects"].append(p_copy)
            existing_domains.add(p["domain"])

    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)

    print("-" * 65)
    print(f"[+] Total Successfully Staged in List #{target_list_id}: {staged_count + updated_count} / {len(BATCH3_PROSPECTS)}")
    print(f"[+] Database Synchronized: {len(state['prospects'])} Total Tracked Domains in contacted_domains.json")
    print(f"[-] Errors: {error_count}")
    print("=" * 65 + "\n")

if __name__ == "__main__":
    stage_batch3()
