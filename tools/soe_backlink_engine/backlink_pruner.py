#!/usr/bin/env python3
"""
SOE Backlink Quality Pruning & Brevo Staging Engine
The Sound of Essentials: Rhythm Quest

Filters raw competitor backlink candidates through ruthless quality filters:
1. Spam Score < 5% (Eliminates PBNs, link farms, spam directories)
2. Organic Monthly Traffic >= 1,000 (Eliminates ghost domains)
3. Age Boundary Purity: Strictly Ages 2–7 (Eliminates Grade 3+ creep)
4. Music Canon Guard: Zero hallucinated claims / live instrumentation

Maps approved prospects to canonical Brevo outreach templates:
- Template 13: 'screen-free phonics' (Homeschool & Mom Bloggers)
- Template 8:  'acoustic speech tool' (Pediatric SLP & OT Clinics)
- Template 7:  '7 preschool domains' (Preschool Directors & Montessori Heads)
"""

import os
import sys
import json
from pathlib import Path

# Base paths
ENGINE_DIR = Path(__file__).resolve().parent
STATE_FILE = ENGINE_DIR / "contacted_domains.json"

QUALITY_THRESHOLDS = {
    "max_spam_score": 5.0,
    "min_traffic": 1000,
    "target_age_min": 2,
    "target_age_max": 7,
}

BANNED_AGE_TERMS = [
    "grade 3", "grade 4", "grade 5", "3rd grade", "4th grade", "5th grade",
    "middle school", "high school", "teen", "teenager", "tweens"
]

BANNED_MUSIC_TERMS = [
    "live instrumentation", "live orchestra", "live instruments", "live music"
]

def load_state():
    if not STATE_FILE.exists():
        print(f"[-] State file not found: {STATE_FILE}")
        sys.exit(1)
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def audit_prospect(prospect):
    """
    Evaluates a prospect against all SOE Helix Gate filters.
    Returns (passed: bool, reason: str).
    """
    # 1. Spam score filter
    spam = prospect.get("spam_score", 0.0)
    if spam > QUALITY_THRESHOLDS["max_spam_score"]:
        return False, f"Spam score {spam}% exceeds max {QUALITY_THRESHOLDS['max_spam_score']}%"

    # 2. Traffic filter
    traffic = prospect.get("estimated_traffic", 0)
    if traffic < QUALITY_THRESHOLDS["min_traffic"]:
        return False, f"Traffic {traffic}/mo below minimum {QUALITY_THRESHOLDS['min_traffic']}"

    # 3. Banned age terms filter
    niche_text = (prospect.get("niche", "") + " " + prospect.get("target_url", "")).lower()
    for term in BANNED_AGE_TERMS:
        if term in niche_text:
            return False, f"Violates Ages 2–7 boundary: matched banned term '{term}'"

    # 4. Canon music terms check
    for term in BANNED_MUSIC_TERMS:
        if term in niche_text:
            return False, f"Violates Music Canon: matched banned claim '{term}'"

    # 5. Template validation
    template_id = prospect.get("brevo_template_id")
    if template_id not in [7, 8, 13]:
        return False, f"Invalid Brevo template ID {template_id}. Must be 7, 8, or 13."

    return True, "PASSED"

def run_prune():
    state = load_state()
    prospects = state.get("prospects", [])
    
    print("\n" + "=" * 65)
    print("      SOE COMPETITOR BACKLINK FILTER & PRUNING ENGINE")
    print("=" * 65)
    print(f"[*] Total Prospects Loaded: {len(prospects)}")
    print(f"[*] Brevo List Destination: #{state.get('brevo_list_id')} ({state.get('brevo_list_name')})")
    print(f"[*] Authenticated Sender:   ID #{state.get('brevo_sender_id')} ({state.get('sender_email')})")
    print("-" * 65)

    approved = []
    disqualified = []

    for idx, p in enumerate(prospects, start=1):
        domain = p.get("domain", "unknown")
        passed, reason = audit_prospect(p)
        if passed:
            approved.append(p)
            print(f"  [PASS] #{idx:02d}: {domain:<26} | Hook: Tpl #{p.get('brevo_template_id')} ({p.get('chosen_hook')})")
        else:
            disqualified.append((p, reason))
            print(f"  [FAIL] #{idx:02d}: {domain:<26} | Reason: {reason}")

    print("-" * 65)
    print(f"[+] Approved Vetted Prospects: {len(approved)} / {len(prospects)} ({len(approved)/len(prospects)*100:.1f}%)")
    print(f"[-] Disqualified Junk Prospects: {len(disqualified)} / {len(prospects)}")
    print("=" * 65 + "\n")
    return approved, disqualified

if __name__ == "__main__":
    approved, disqualified = run_prune()
