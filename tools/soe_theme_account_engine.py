"""
The Sound of Essentials: Rhythm Quest — Alt & Theme Account Multiplier Engine
Implements the Ex-Def Jam 90-Post Narrative Testing Architecture:
10 Core Assets x 3 Narrative Angles x 3 Theme Accounts = 90 Organic Testing Touchpoints.

Usage:
  python tools/soe_theme_account_engine.py --status
  python tools/soe_theme_account_engine.py --generate-matrix
  python tools/soe_theme_account_engine.py --record-result --id <ITEM_ID> --views <INT> --saves <INT>
  python tools/soe_theme_account_engine.py --winners
"""

import os
import sys
import json
import argparse
from datetime import datetime
from pathlib import Path

# Fix Windows cp1252 encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent
DOCS_DIR = REPO_ROOT / "docs"
MATRIX_FILE = DOCS_DIR / "theme_account_testing_matrix.json"

THEME_PROFILES = [
    {
        "profile_id": "profile_screenfree",
        "handle": "@screenfreefamily",
        "niche": "Conscious & Screen-Free Parenting",
        "primary_delta": "Screen vs. Sensory",
        "target_audience": "Mothers & Fathers (Ages 2-7)"
    },
    {
        "profile_id": "profile_sensorykids",
        "handle": "@sensoryrhythmkids",
        "niche": "Montessori Tactile & Phonics Scaffolding",
        "primary_delta": "Testing vs. Arts",
        "target_audience": "Homeschool Parents & Occupational Therapists"
    },
    {
        "profile_id": "profile_calmcircle",
        "handle": "@calmcircletime",
        "niche": "ECE Classroom Transitions & Co-Regulation",
        "primary_delta": "Institution vs. Sanctuary",
        "target_audience": "Preschool & Kindergarten Teachers"
    }
]

CORE_ASSETS = [
    {
        "asset_id": "asset_01_bedtime_calm",
        "name": "Celestia Bedtime Storybook",
        "type": "Illustration / Storybook Flip",
        "land": "Celestia",
        "track": "Track 18: The Quiet Constellation"
    },
    {
        "asset_id": "asset_02_sound_before_symbol",
        "name": "Sonoria Kenji & Aiko Echo Walk",
        "type": "Character Story Scene",
        "land": "Sonoria",
        "track": "Track 4: Phonics Echo Walk"
    },
    {
        "asset_id": "asset_03_lets_stretch",
        "name": "Kinesthetica Cross-Body Movement",
        "type": "Movement Audio Reel",
        "land": "Kinesthetica",
        "track": "Track 11: Let's Stretch"
    },
    {
        "asset_id": "asset_04_rhythm_walk",
        "name": "Terrasol Foundation Clapping",
        "type": "Studio Audio Demo",
        "land": "Terrasol",
        "track": "Track 2: Rhythm Walk"
    },
    {
        "asset_id": "asset_05_dad_coloring",
        "name": "Dad & Child Paper Tracing Session",
        "type": "Tactile Photo / Video",
        "land": "Terra Verde",
        "track": "Track 8: Garden Harmony"
    },
    {
        "asset_id": "asset_06_french_le_cheval",
        "name": "Luminosity Bilingual Curiosity",
        "type": "Animated Story Staff",
        "land": "Luminosity",
        "track": "Track 5: Le Cheval"
    },
    {
        "asset_id": "asset_07_drill_time",
        "name": "Kinesthetica Bilateral Tap",
        "type": "Gross Motor Drill",
        "land": "Kinesthetica",
        "track": "Track 12: Drill Time"
    },
    {
        "asset_id": "asset_08_aquaria_calm",
        "name": "Aquaria Breathing Sanctuary",
        "type": "Somatic Reset Audio",
        "land": "Aquaria",
        "track": "Track 6: Calm Waters"
    },
    {
        "asset_id": "asset_09_seriphia_halo",
        "name": "Seriphia Golden Storybook Art",
        "type": "Canonical Hero Showcase",
        "land": "Terrasol",
        "track": "Track 1: Hello, 7 Lands!"
    },
    {
        "asset_id": "asset_10_numbers_tempo",
        "name": "Numeria Rhythmic Counting 1-20",
        "type": "Call-and-Response Audio Reel",
        "land": "Numeria",
        "track": "Track 3: Numbers Echo"
    }
]

NARRATIVE_TEMPLATES = {
    "profile_screenfree": {
        "angle_name": "Screen Dysregulation & Bedtime Sanctuary",
        "hook_prefix": "What happened to our toddler's nervous system when we banned high-tempo cartoons and put on",
        "cta": "Download all 19 tracks free at soelearn.com/listen"
    },
    "profile_sensorykids": {
        "angle_name": "Sound-Before-Symbol & Phonics Scaffolding",
        "hook_prefix": "Why worksheets fail 4-year-olds: How neural rhythm decodes phonics through",
        "cta": "Stream the free curriculum album at soelearn.com/listen"
    },
    "profile_calmcircle": {
        "angle_name": "Classroom Transition & Auditory Co-Regulation",
        "hook_prefix": "The 90-second circle time cue that stops classroom chaos in",
        "cta": "Free educator soundscapes at soelearn.com/listen"
    }
}

def generate_matrix():
    items = []
    for asset in CORE_ASSETS:
        for profile in THEME_PROFILES:
            pid = profile["profile_id"]
            template = NARRATIVE_TEMPLATES[pid]
            item_id = f"{asset['asset_id']}_{pid}"
            headline = f"{template['hook_prefix']} {asset['name']} ({asset['land']})"
            
            items.append({
                "item_id": item_id,
                "asset_id": asset["asset_id"],
                "asset_name": asset["name"],
                "land": asset["land"],
                "track": asset["track"],
                "target_profile": profile["handle"],
                "profile_id": pid,
                "cultural_delta": profile["primary_delta"],
                "narrative_angle": template["angle_name"],
                "headline": headline,
                "destination_url": f"https://soelearn.com/listen?utm_source=theme_testing&utm_medium=alt_{pid}&utm_campaign={asset['asset_id']}",
                "status": "QUEUED",
                "metrics": {
                    "views": 0,
                    "saves": 0,
                    "shares": 0,
                    "clicks": 0,
                    "save_rate_pct": 0.0
                },
                "is_winner": False,
                "tested_at": None
            })

    matrix_data = {
        "version": "1.0.0",
        "generated_at": datetime.now().isoformat(),
        "total_items": len(items),
        "total_assets": len(CORE_ASSETS),
        "total_profiles": len(THEME_PROFILES),
        "items": items
    }

    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    with open(MATRIX_FILE, "w", encoding="utf-8") as f:
        json.dump(matrix_data, f, indent=2, ensure_ascii=False)

    print(f"[+] Successfully generated 90-item testing matrix into: {MATRIX_FILE}")
    return matrix_data

def load_matrix():
    if not MATRIX_FILE.exists():
        return generate_matrix()
    with open(MATRIX_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_matrix(data):
    with open(MATRIX_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def show_status():
    data = load_matrix()
    items = data["items"]
    
    queued = sum(1 for i in items if i["status"] == "QUEUED")
    tested = sum(1 for i in items if i["status"] == "TESTED")
    winners = sum(1 for i in items if i.get("is_winner"))

    print("==================================================")
    print("[*] SOE THEME ACCOUNT MULTIPLIER ENGINE STATUS")
    print("==================================================")
    print(f"Total Content Items in Matrix: {len(items)}")
    print(f"Queued for Testing: {queued}")
    print(f"Tested & Logged: {tested}")
    print(f"Proven Winners (Qualified for Seeding): {winners}\n")
    
    print("Target Theme Profiles:")
    for p in THEME_PROFILES:
        profile_items = [i for i in items if i["profile_id"] == p["profile_id"]]
        print(f"  * {p['handle']:22} [{p['niche']}] ({len(profile_items)} items)")
    print("==================================================")

def record_result(item_id: str, views: int, saves: int):
    data = load_matrix()
    found = False
    for item in data["items"]:
        if item["item_id"] == item_id:
            found = True
            item["status"] = "TESTED"
            item["tested_at"] = datetime.now().isoformat()
            item["metrics"]["views"] = views
            item["metrics"]["saves"] = saves
            save_rate = (saves / views * 100.0) if views > 0 else 0.0
            item["metrics"]["save_rate_pct"] = round(save_rate, 2)
            
            # Winner criterion: views >= 50,000 OR (views >= 5,000 AND save_rate >= 5.0%)
            if views >= 50000 or (views >= 5000 and save_rate >= 5.0):
                item["is_winner"] = True
                print(f"[+] [WINNER QUALIFIED] Item {item_id} qualified for Paid Seeding!")
            else:
                item["is_winner"] = False

            print(f"[+] Recorded results for {item_id}: {views:,} views, {saves:,} saves ({save_rate:.2f}% save rate)")
            break
            
    if not found:
        print(f"[-] Item ID '{item_id}' not found in matrix.", file=sys.stderr)
        return False
        
    save_matrix(data)
    return True

def list_winners():
    data = load_matrix()
    winners = [i for i in data["items"] if i.get("is_winner")]
    print("==================================================")
    print(f"[*] SOE PROVEN WINNERS (QUALIFIED FOR SEEDING CATALOG) [{len(winners)}]")
    print("==================================================")
    if not winners:
        print("No winners recorded yet. Test items using --record-result to qualify them for paid seeding.")
    for idx, w in enumerate(winners, 1):
        print(f"{idx}. [{w['target_profile']}] {w['headline']}")
        print(f"   Views: {w['metrics']['views']:,} | Saves: {w['metrics']['saves']:,} ({w['metrics']['save_rate_pct']}%)")
        print(f"   Destination: {w['destination_url']}\n")
    print("==================================================")

def main():
    parser = argparse.ArgumentParser(description="SOE Theme Account Multiplier Engine")
    parser.add_argument("--status", action="store_true", help="Show matrix status")
    parser.add_argument("--generate-matrix", action="store_true", help="Regenerate the 90-item matrix")
    parser.add_argument("--record-result", action="store_true", help="Record test metrics")
    parser.add_argument("--id", help="Item ID to update")
    parser.add_argument("--views", type=int, default=0, help="View count")
    parser.add_argument("--saves", type=int, default=0, help="Save count")
    parser.add_argument("--winners", action="store_true", help="List all winning items")
    args = parser.parse_args()

    if args.generate_matrix:
        generate_matrix()
    elif args.record_result:
        if not args.id:
            print("[-] Must provide --id with --record-result", file=sys.stderr)
            sys.exit(1)
        record_result(args.id, args.views, args.saves)
    elif args.winners:
        list_winners()
    else:
        show_status()

if __name__ == "__main__":
    main()
