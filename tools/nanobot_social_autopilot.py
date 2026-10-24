"""
The Sound of Essentials: Rhythm Quest — Nanobot Social Autopilot Engine
Orchestrates autonomous scheduled publishing of Seed Posts and Long-Form Advertorials
to the Facebook Page (ID: 1238685869335542) with a state ledger to prevent duplicates.

Usage:
  python tools/nanobot_social_autopilot.py --status
  python tools/nanobot_social_autopilot.py --next --dry-run
  python tools/nanobot_social_autopilot.py --next
  python tools/nanobot_social_autopilot.py --drip-all --interval-hours 24
"""

import os
import sys
import json
import argparse
from datetime import datetime
from pathlib import Path

# Paths
REPO_ROOT = Path(__file__).resolve().parent.parent
WORKSPACE_ROOT = REPO_ROOT.parent
LEDGER_FILE = REPO_ROOT / "docs" / "facebook_published_ledger.json"
SEED_JSON = REPO_ROOT / "docs" / "facebook_seed_catalog.json"
ADV_JSON = REPO_ROOT / "docs" / "facebook_advertorials_catalog.json"

# Import publisher logic
sys.path.insert(0, str(REPO_ROOT / "tools"))
try:
    from seed_facebook_page import publish_post_to_facebook, load_env, verify_meta_connection, SEED_POSTS, ADVERTORIAL_POSTS
except ImportError as e:
    print(f"[-] Import error: {e}", file=sys.stderr)
    sys.exit(1)

ENV = load_env()

def load_ledger():
    if LEDGER_FILE.exists():
        try:
            with open(LEDGER_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"published_post_keys": [], "history": []}

def save_ledger(ledger):
    LEDGER_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(LEDGER_FILE, "w", encoding="utf-8") as f:
        json.dump(ledger, f, indent=2, ensure_ascii=False)

def get_full_queue():
    """Combines seed posts and advertorials into an optimal publishing queue."""
    queue = []
    # Mix alternating seed and advertorial for maximum content variety
    # Order: Seed 1 (Origin), Adv 1 (Mom Flagship), Seed 2 (Sound-before-symbol),
    # Adv 2 (Sing-Along), Seed 3 (7 Lands), Adv 3 (Sovereignty),
    # Seed 4 (Morning Reset), Adv 4 (Global ESL), Seed 5 (Books),
    # Adv 5 (Dad Listicle), Seed 6 (Teachers), Seed 7 (Community discussion)
    seed_map = {p["post_num"]: p for p in SEED_POSTS}
    adv_map = {p["post_num"]: p for p in ADVERTORIAL_POSTS}

    schedule_plan = [
        ("seed", 1),
        ("adv", 1),
        ("seed", 2),
        ("adv", 2),
        ("seed", 3),
        ("adv", 3),
        ("seed", 4),
        ("adv", 4),
        ("seed", 5),
        ("adv", 5),
        ("seed", 6),
        ("seed", 7)
    ]

    for ptype, num in schedule_plan:
        if ptype == "seed" and num in seed_map:
            p = dict(seed_map[num])
            p["unique_key"] = f"seed_{num}"
            p["content_type"] = "Seed Post"
            queue.append(p)
        elif ptype == "adv" and num in adv_map:
            p = dict(adv_map[num])
            p["unique_key"] = f"adv_{num}"
            p["content_type"] = "Long-Form Advertorial"
            queue.append(p)

    return queue

def show_status():
    ledger = load_ledger()
    queue = get_full_queue()
    published_keys = set(ledger.get("published_post_keys", []))

    print(f"==================================================")
    print(f"🤖 NANOBOT FACEBOOK AUTOPILOT STATUS")
    print(f"==================================================")
    print(f"Total Content Items in Queue: {len(queue)}")
    print(f"Already Published: {len(published_keys)}")
    print(f"Remaining in Queue: {len(queue) - len(published_keys)}\n")

    print("Publishing Queue & Ledger State:")
    for idx, item in enumerate(queue, 1):
        key = item["unique_key"]
        is_done = key in published_keys
        status_badge = "✅ PUBLISHED" if is_done else "⏳ QUEUED"
        print(f"  {idx:2d}. [{status_badge}] {item['content_type']} #{item['post_num']}: {item['headline'][:50]}...")
    print(f"==================================================")

def publish_next(token: str, page_id: str, dry_run: bool = False):
    ledger = load_ledger()
    queue = get_full_queue()
    published_keys = set(ledger.get("published_post_keys", []))

    next_item = None
    for item in queue:
        if item["unique_key"] not in published_keys:
            next_item = item
            break

    if not next_item:
        print("[+] All 12 items in the queue have already been published! Ledger complete.")
        return True

    print(f"[*] Autopilot Selected Next Post: {next_item['unique_key']} ({next_item['content_type']} #{next_item['post_num']})")
    print(f"    Headline: {next_item['headline']}")
    print(f"    Image: {next_item['image_file'].name}")

    if not dry_run:
        valid, _ = verify_meta_connection(token, page_id)
        if not valid:
            print("[-] Cannot publish: Token verification failed.", file=sys.stderr)
            return False

    ok = publish_post_to_facebook(page_id, token, next_item, dry_run=dry_run, post_type=next_item["content_type"])
    if ok and not dry_run:
        ledger["published_post_keys"].append(next_item["unique_key"])
        ledger["history"].append({
            "key": next_item["unique_key"],
            "content_type": next_item["content_type"],
            "post_num": next_item["post_num"],
            "headline": next_item["headline"],
            "published_at": datetime.now().isoformat(),
            "image": str(next_item["image_file"])
        })
        save_ledger(ledger)
        print(f"[+] Successfully recorded '{next_item['unique_key']}' into published ledger!")
    elif ok and dry_run:
        print(f"[+] [DRY-RUN] Next post '{next_item['unique_key']}' validated successfully.")

    return ok

def main():
    parser = argparse.ArgumentParser(description="Nanobot Social Autopilot Engine")
    parser.add_argument("--status", action="store_true", help="Display current queue and ledger state")
    parser.add_argument("--next", action="store_true", help="Publish the next queued post")
    parser.add_argument("--dry-run", action="store_true", help="Simulate execution without sending live API calls")
    parser.add_argument("--curator-recon", action="store_true", help="Display status and metrics for the 50 micro-curator registry")
    parser.add_argument("--token", help="Override Meta Access Token from CLI")
    parser.add_argument("--page-id", help="Override Facebook Page ID from CLI")
    args = parser.parse_args()

    if args.curator_recon:
        try:
            from nanobot_curator_scraper import show_status as show_curator_status
            show_curator_status()
        except ImportError:
            print("[-] nanobot_curator_scraper not found.", file=sys.stderr)
        return

    token = args.token or os.getenv("META_PAGE_ACCESS_TOKEN") or ENV.get("META_PAGE_ACCESS_TOKEN") or os.getenv("META_ACCESS_TOKEN") or ENV.get("META_ACCESS_TOKEN") or ""
    page_id = args.page_id or os.getenv("META_PAGE_ID") or ENV.get("META_PAGE_ID") or "1238685869335542"

    if args.status or (not args.next and not args.dry_run):
        show_status()
        return

    if args.next:
        publish_next(token, page_id, dry_run=args.dry_run)

if __name__ == "__main__":
    main()
