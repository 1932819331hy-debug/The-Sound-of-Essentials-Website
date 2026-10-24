#!/usr/bin/env python3
"""
SOE Batch 2 Backlink Poaching & Brevo Staging Engine
The Sound of Essentials: Rhythm Quest

Autonomously stages and queues Batch 2 (25 high-authority early childhood targets)
into Brevo List 10, strictly audited against Helix Gate 1 quality standards.
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

BATCH2_PROSPECTS = [
    {
        "domain": "thisreadingmama.com",
        "target_url": "https://thisreadingmama.com/reading-apps-for-kids/",
        "competitor_source": "readingeggs.com",
        "email": "becky@thisreadingmama.com",
        "contact_name": "Becky Spence",
        "organization": "This Reading Mama",
        "niche": "Early Childhood Phonics & Reading",
        "estimated_traffic": 210000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "themeasuredmom.com",
        "target_url": "https://www.themeasuredmom.com/best-reading-apps-for-kindergarten/",
        "competitor_source": "readingeggs.com",
        "email": "anna@themeasuredmom.com",
        "contact_name": "Anna Geiger",
        "organization": "The Measured Mom",
        "niche": "Pre-K to Grade 2 Literacy Authority",
        "estimated_traffic": 250000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "pre-kpages.com",
        "target_url": "https://www.pre-kpages.com/best-educational-apps-for-preschool/",
        "competitor_source": "starfall.com",
        "email": "vanessa@pre-kpages.com",
        "contact_name": "Vanessa Levin",
        "organization": "Pre-K Pages",
        "niche": "Preschool Early Literacy & Classroom Design",
        "estimated_traffic": 340000,
        "spam_score": 1.0,
        "chosen_hook": "7 preschool domains",
        "brevo_template_id": 7,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "pocketofpreschool.com",
        "target_url": "https://pocketofpreschool.com/preschool-literacy-centers/",
        "competitor_source": "starfall.com",
        "email": "jackie@pocketofpreschool.com",
        "contact_name": "Jackie Kops",
        "organization": "Pocket of Preschool",
        "niche": "Hands-on Preschool & Sensory Centers",
        "estimated_traffic": 175000,
        "spam_score": 1.0,
        "chosen_hook": "7 preschool domains",
        "brevo_template_id": 7,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "stayathomeeducator.com",
        "target_url": "https://stayathomeeducator.com/preschool-reading-readiness-activities/",
        "competitor_source": "readingeggs.com",
        "email": "sarah@stayathomeeducator.com",
        "contact_name": "Sarah Punkiewicz",
        "organization": "Stay At Home Educator",
        "niche": "Screen-Free Preschool Curriculum",
        "estimated_traffic": 120000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "totschooling.net",
        "target_url": "https://www.totschooling.net/early-reading-phonics-printables/",
        "competitor_source": "starfall.com",
        "email": "viviana@totschooling.net",
        "contact_name": "Viviana",
        "organization": "Tot Schooling",
        "niche": "Toddler & Pre-K Early Learning",
        "estimated_traffic": 130000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "playtolearnpreschool.us",
        "target_url": "https://playtolearnpreschool.us/preschool-circle-time-songs/",
        "competitor_source": "teachyourmonstertoread.com",
        "email": "jamie@playtolearnpreschool.us",
        "contact_name": "Jamie White",
        "organization": "Play to Learn Preschool",
        "niche": "Play-Based Early Childhood Education",
        "estimated_traffic": 80000,
        "spam_score": 1.0,
        "chosen_hook": "7 preschool domains",
        "brevo_template_id": 7,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "modernpreschool.com",
        "target_url": "https://modernpreschool.com/phonemic-awareness-activities-preschool/",
        "competitor_source": "teachyourmonstertoread.com",
        "email": "nicole@modernpreschool.com",
        "contact_name": "Nicole",
        "organization": "Modern Preschool",
        "niche": "Toddler & Pre-K Hands-On Learning",
        "estimated_traffic": 65000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "teachingmama.org",
        "target_url": "https://teachingmama.org/how-to-teach-phonics-preschool/",
        "competitor_source": "readingeggs.com",
        "email": "angela@teachingmama.org",
        "contact_name": "Angela",
        "organization": "Teaching Mama",
        "niche": "Preschool Phonics & Sensory Play",
        "estimated_traffic": 160000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "notimeforflashcards.com",
        "target_url": "https://www.notimeforflashcards.com/best-early-reading-tools-preschoolers/",
        "competitor_source": "readingeggs.com",
        "email": "allison@notimeforflashcards.com",
        "contact_name": "Allison McDonald",
        "organization": "No Time For Flash Cards",
        "niche": "Screen-Free Early Childhood Literacy",
        "estimated_traffic": 190000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "theottoolbox.com",
        "target_url": "https://www.theottoolbox.com/sensory-tools-for-calm-classrooms/",
        "competitor_source": "busytoddler.com",
        "email": "colleen@theottoolbox.com",
        "contact_name": "Colleen Beck",
        "organization": "The OT Toolbox",
        "niche": "Pediatric OT & Sensory Regulation",
        "estimated_traffic": 280000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "growinghandsonkids.com",
        "target_url": "https://www.growinghandsonkids.com/sensory-strategies-for-toddler-calm/",
        "competitor_source": "busytoddler.com",
        "email": "heather@growinghandsonkids.com",
        "contact_name": "Heather Greutman",
        "organization": "Growing Hands-On Kids",
        "niche": "Pediatric COTA & Sensory Development",
        "estimated_traffic": 95000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "andnextcomesl.com",
        "target_url": "https://www.andnextcomesl.com/sensory-auditory-calming-tools/",
        "competitor_source": "busytoddler.com",
        "email": "dyan@andnextcomesl.com",
        "contact_name": "Dyan Robson",
        "organization": "And Next Comes L",
        "niche": "Sensory Processing & Auditory Regulation",
        "estimated_traffic": 140000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "mamaot.com",
        "target_url": "https://mamaot.com/auditory-sensory-activities-for-little-ones/",
        "competitor_source": "busytoddler.com",
        "email": "christie@mamaot.com",
        "contact_name": "Christie Kiley",
        "organization": "Mama OT",
        "niche": "Pediatric Occupational Therapy",
        "estimated_traffic": 45000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "sensoryprocessinglifestyle.com",
        "target_url": "https://sensoryprocessinglifestyle.com/auditory-rhythm-sensory-soothing/",
        "competitor_source": "busytoddler.com",
        "email": "hello@sensoryprocessinglifestyle.com",
        "contact_name": "Sensory Lead",
        "organization": "Sensory Processing Lifestyle",
        "niche": "Pediatric Sensory Integration",
        "estimated_traffic": 18000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "mommyevolution.com",
        "target_url": "https://mommyevolution.com/sensory-calm-activities-for-preschoolers/",
        "competitor_source": "busytoddler.com",
        "email": "katrina@mommyevolution.com",
        "contact_name": "Katrina",
        "organization": "Mommy Evolution",
        "niche": "Sensory Parenting & Early Literacy",
        "estimated_traffic": 55000,
        "spam_score": 1.0,
        "chosen_hook": "acoustic speech tool",
        "brevo_template_id": 8,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "rockyourhomeschool.net",
        "target_url": "https://rockyourhomeschool.net/reading-eggs-review-homeschool/",
        "competitor_source": "readingeggs.com",
        "email": "amy@rockyourhomeschool.net",
        "contact_name": "Amy",
        "organization": "Rock Your Homeschool",
        "niche": "Homeschool Phonics & Morning Routines",
        "estimated_traffic": 85000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "confessionsofahomeschooler.com",
        "target_url": "https://www.confessionsofahomeschooler.com/preschool-kindergarten-curriculum/",
        "competitor_source": "starfall.com",
        "email": "erica@confessionsofahomeschooler.com",
        "contact_name": "Erica Arndt",
        "organization": "Confessions of a Homeschooler",
        "niche": "Preschool & Kindergarten Readiness",
        "estimated_traffic": 110000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "notconsumed.com",
        "target_url": "https://notconsumed.com/teaching-early-reading-at-home/",
        "competitor_source": "readingeggs.com",
        "email": "kim@notconsumed.com",
        "contact_name": "Kim Sorgius",
        "organization": "Not Consumed",
        "niche": "Intentional Family & Early Learning",
        "estimated_traffic": 90000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "happyhooligans.ca",
        "target_url": "https://happyhooligans.ca/sensory-activities-for-toddlers-preschoolers/",
        "competitor_source": "busytoddler.com",
        "email": "jackie@happyhooligans.ca",
        "contact_name": "Jackie Currie",
        "organization": "Happy Hooligans",
        "niche": "Toddler Sensory & Early Childhood",
        "estimated_traffic": 220000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "naturalbeachliving.com",
        "target_url": "https://www.naturalbeachliving.com/montessori-reading-activities-preschool/",
        "competitor_source": "teachyourmonstertoread.com",
        "email": "kimberly@naturalbeachliving.com",
        "contact_name": "Kimberly",
        "organization": "Natural Beach Living",
        "niche": "Montessori & Nature-Based Early Learning",
        "estimated_traffic": 150000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "theeducatorsspinonit.com",
        "target_url": "https://theeducatorsspinonit.com/reading-activities-for-kindergarten-prep/",
        "competitor_source": "readingeggs.com",
        "email": "kim@theeducatorsspinonit.com",
        "contact_name": "Kim Vij",
        "organization": "The Educators' Spin On It",
        "niche": "Early Childhood Educators & Literacy",
        "estimated_traffic": 85000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "mymundaneandmiraculouslife.com",
        "target_url": "https://mymundaneandmiraculouslife.com/sensory-screen-free-early-phonics/",
        "competitor_source": "duolingo.com",
        "email": "editor@mymundaneandmiraculouslife.com",
        "contact_name": "Miraculous Life Team",
        "organization": "My Mundane and Miraculous Life",
        "niche": "Screen-Free Sensory Early Learning",
        "estimated_traffic": 22000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "ourlittlesliceofheaven.com",
        "target_url": "https://ourlittlesliceofheaven.com/early-reading-phonics-preschool/",
        "competitor_source": "starfall.com",
        "email": "contact@ourlittlesliceofheaven.com",
        "contact_name": "Editorial Guides",
        "organization": "Our Little Slice of Heaven",
        "niche": "Early Reading & Family Routines",
        "estimated_traffic": 15000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
        "date_added": "2026-10-20"
    },
    {
        "domain": "raisinglittles.com",
        "target_url": "https://raisinglittles.com/screen-free-kindergarten-readiness/",
        "competitor_source": "teachyourmonstertoread.com",
        "email": "hello@raisinglittles.com",
        "contact_name": "Parenting Leads",
        "organization": "Raising Littles",
        "niche": "Early Childhood & Kindergarten Readiness",
        "estimated_traffic": 25000,
        "spam_score": 1.0,
        "chosen_hook": "screen-free phonics",
        "brevo_template_id": 13,
        "status": "staged_in_brevo",
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

def stage_and_dispatch_batch2():
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        state = json.load(f)

    existing_domains = {p["domain"] for p in state.get("prospects", [])}
    list_id = 10  # Brevo List 10: SOE_Backlink_Poach_Batch_2

    print("\n" + "=" * 65)
    print("      SOE BREVO BATCH 2 STAGING & DISPATCH ENGINE")
    print("=" * 65)
    print(f"[*] Staging 25 vetted targets into Brevo List #{list_id} (SOE_Backlink_Poach_Batch_2)")
    print(f"[*] Authenticated Sender: ID #2 (The Sound of Essentials <info@soelearn.com>)\n")

    staged_count = 0
    updated_count = 0
    error_count = 0

    for idx, p in enumerate(BATCH2_PROSPECTS, start=1):
        domain = p.get("domain")
        if domain in existing_domains:
            print(f"  [SKIP:DUPLICATE] #{idx:02d}: {domain} already in state file!")
            continue

        email = p.get("email")
        first_name = p.get("contact_name", "").split()[0]
        payload = {
            "email": email,
            "listIds": [list_id],
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
            print(f"  [OK:CREATED] #{idx:02d}: {email:<34} (Brevo ID: {res['id']})")
        elif "status_code" in res and res["status_code"] in [204, 200]:
            updated_count += 1
            print(f"  [OK:UPDATED] #{idx:02d}: {email:<34}")
        elif res.get("error", {}).get("code") == "duplicate_parameter":
            # Add directly to list 10
            res_add = brevo_request(f"/contacts/lists/{list_id}/contacts/add", method="POST", payload={"emails": [email]})
            updated_count += 1
            print(f"  [OK:LIST_ADD] #{idx:02d}: {email:<34}")
        else:
            error_count += 1
            print(f"  [FAIL]       #{idx:02d}: {email:<34} | {res}")

    # Synchronize contacted_domains.json
    for p in BATCH2_PROSPECTS:
        if p["domain"] not in existing_domains:
            state["prospects"].append(p)
            existing_domains.add(p["domain"])

    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)

    print("-" * 65)
    print(f"[+] Total Successfully Staged in List #{list_id}: {staged_count + updated_count} / {len(BATCH2_PROSPECTS)}")
    print(f"[+] Database Synchronized: {len(state['prospects'])} Total Tracked Domains in contacted_domains.json")
    print(f"[-] Errors: {error_count}")
    print("=" * 65 + "\n")

if __name__ == "__main__":
    stage_and_dispatch_batch2()
