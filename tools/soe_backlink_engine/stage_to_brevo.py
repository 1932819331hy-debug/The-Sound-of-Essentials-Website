#!/usr/bin/env python3
"""
SOE Brevo Pilot Staging Engine
The Sound of Essentials: Rhythm Quest

Stages the 25 vetted competitor backlink prospects directly into:
- Brevo List ID: 9 (SOE_Backlink_Poach_Pilot)
- Authenticated Sender ID: 2 (The Sound of Essentials <info@soelearn.com>)
- Enriched Custom Attributes: FIRSTNAME, ORGANIZATION, COMPETITOR_SOURCE, TARGET_PAGE_URL, BIO_HOOK
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

def stage_contacts():
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        state = json.load(f)

    prospects = state.get("prospects", [])
    list_id = state.get("brevo_list_id", 9)

    print("\n" + "=" * 65)
    print("      SOE BREVO STAGING ENGINE (LIST #9 PILOT BATCH)")
    print("=" * 65)
    print(f"[*] Staging {len(prospects)} prospects to Brevo List #{list_id}...")
    print(f"[*] Authenticated Sender: ID #2 (info@soelearn.com)\n")

    staged_count = 0
    updated_count = 0
    error_count = 0

    for idx, p in enumerate(prospects, start=1):
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
        
        # 201 Created or 204 Updated
        if "id" in res:
            staged_count += 1
            print(f"  [OK:CREATED] #{idx:02d}: {email:<32} (Brevo ID: {res['id']})")
        elif "status_code" in res and res["status_code"] in [204, 200]:
            updated_count += 1
            print(f"  [OK:UPDATED] #{idx:02d}: {email:<32}")
        elif res.get("error", {}).get("code") == "duplicate_parameter":
            # Already exists, add to list specifically
            res_add = brevo_request(f"/contacts/lists/{list_id}/contacts/add", method="POST", payload={"emails": [email]})
            updated_count += 1
            print(f"  [OK:LIST_ADD] #{idx:02d}: {email:<32}")
        else:
            error_count += 1
            print(f"  [FAIL]       #{idx:02d}: {email:<32} | {res}")

    print("\n" + "-" * 65)
    print(f"[+] Total Successfully Staged in List #{list_id}: {staged_count + updated_count} / {len(prospects)}")
    print(f"[-] Errors: {error_count}")
    print("=" * 65 + "\n")

if __name__ == "__main__":
    stage_contacts()
