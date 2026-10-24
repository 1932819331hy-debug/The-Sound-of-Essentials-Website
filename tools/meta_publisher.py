"""
The Sound of Essentials: Rhythm Quest — Meta (Facebook & Instagram) Publisher
Automated posting engine for Facebook Page and Instagram Business Account via Meta Graph API v21.0.

Supported operations:
1. verify: Check token validity, permissions, and connected Page/Instagram accounts.
2. post_fb: Publish a text or photo post to the Facebook Page.
3. post_ig: Publish a photo or carousel to the Instagram Business Account.
"""

import os
import sys
import json
import argparse
import urllib.request
import urllib.parse
from pathlib import Path

# Load environment variables from .env
ENV_FILE = Path(__file__).resolve().parent.parent / ".env"

def load_env():
    env_vars = {}
    if ENV_FILE.exists():
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    env_vars[key.strip()] = val.strip().strip('"').strip("'")
    return env_vars

ENV = load_env()
GRAPH_API_VERSION = "v21.0"
BASE_URL = f"https://graph.facebook.com/{GRAPH_API_VERSION}"

def api_get(endpoint: str, params: dict):
    query = urllib.parse.urlencode(params)
    url = f"{BASE_URL}/{endpoint}?{query}"
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"[-] Meta API GET Error ({e.code}): {error_body}", file=sys.stderr)
        return {"error": error_body}

def api_post(endpoint: str, data: dict):
    url = f"{BASE_URL}/{endpoint}"
    encoded_data = urllib.parse.urlencode(data).encode("utf-8")
    req = urllib.request.Request(url, data=encoded_data, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"[-] Meta API POST Error ({e.code}): {error_body}", file=sys.stderr)
        return {"error": error_body}

def verify_token(token: str):
    print("[*] Verifying Meta Access Token...")
    # Check /me
    me_data = api_get("me", {"access_token": token, "fields": "id,name"})
    if "error" in me_data:
        print("[-] Invalid or expired token.")
        return None
    print(f"[+] Token User/Identity: {me_data.get('name')} (ID: {me_data.get('id')})")

    # Check connected Pages
    accounts_data = api_get("me/accounts", {"access_token": token, "fields": "id,name,access_token,instagram_business_account"})
    pages = accounts_data.get("data", [])
    if not pages:
        print("[!] Note: Token is a User token. No managed Pages returned or permissions needed.")
        return me_data

    print(f"[+] Found {len(pages)} connected Page(s):")
    for p in pages:
        ig = p.get("instagram_business_account", {})
        ig_id = ig.get("id") if ig else "None linked"
        print(f"    - Page: {p.get('name')} (ID: {p.get('id')}) | Linked IG: {ig_id}")
    return pages

def post_to_facebook(page_id: str, access_token: str, message: str, link: str = None, photo_url: str = None):
    print(f"[*] Posting to Facebook Page {page_id}...")
    if photo_url:
        payload = {
            "access_token": access_token,
            "url": photo_url,
            "caption": message,
        }
        res = api_post(f"{page_id}/photos", payload)
    else:
        payload = {
            "access_token": access_token,
            "message": message,
        }
        if link:
            payload["link"] = link
        res = api_post(f"{page_id}/feed", payload)

    if "id" in res:
        print(f"[+] Successfully published to Facebook! Post ID: {res['id']}")
    else:
        print(f"[-] Failed to publish post: {res}")
    return res

def post_to_instagram(ig_user_id: str, access_token: str, image_url: str, caption: str):
    print(f"[*] Posting to Instagram Account {ig_user_id}...")
    # Step 1: Create Media Container
    container_payload = {
        "access_token": access_token,
        "image_url": image_url,
        "caption": caption,
    }
    container_res = api_post(f"{ig_user_id}/media", container_payload)
    creation_id = container_res.get("id")
    if not creation_id:
        print(f"[-] Failed to create IG media container: {container_res}")
        return container_res

    print(f"[+] Media container created: {creation_id}. Publishing...")
    # Step 2: Publish Container
    publish_payload = {
        "access_token": access_token,
        "creation_id": creation_id,
    }
    publish_res = api_post(f"{ig_user_id}/media_publish", publish_payload)
    if "id" in publish_res:
        print(f"[+] Successfully published to Instagram! Media ID: {publish_res['id']}")
    else:
        print(f"[-] Failed to publish IG container: {publish_res}")
    return publish_res

def main():
    parser = argparse.ArgumentParser(description="SOE Meta Facebook & Instagram Automated Publisher")
    parser.add_argument("--action", choices=["verify", "post_fb", "post_ig"], default="verify")
    parser.add_argument("--message", help="Post copy / caption text")
    parser.add_argument("--image_url", help="Public HTTPS URL for image/photo")
    parser.add_argument("--link", help="Destination link for Facebook post")
    args = parser.parse_args()

    token = os.getenv("META_PAGE_ACCESS_TOKEN") or ENV.get("META_PAGE_ACCESS_TOKEN") or os.getenv("META_ACCESS_TOKEN") or ENV.get("META_ACCESS_TOKEN")
    page_id = os.getenv("META_PAGE_ID") or ENV.get("META_PAGE_ID")
    ig_id = os.getenv("META_IG_USER_ID") or ENV.get("META_IG_USER_ID")

    if not token:
        print("[-] No META_PAGE_ACCESS_TOKEN or META_ACCESS_TOKEN found in .env or environment.")
        print("    Add META_PAGE_ACCESS_TOKEN=your_token_here to .env to enable publishing.")
        sys.exit(1)

    if args.action == "verify":
        verify_token(token)
    elif args.action == "post_fb":
        if not page_id:
            print("[-] META_PAGE_ID is required to post to Facebook. Add it to .env or pass it.")
            sys.exit(1)
        if not args.message:
            print("[-] --message is required.")
            sys.exit(1)
        post_to_facebook(page_id, token, args.message, args.link, args.image_url)
    elif args.action == "post_ig":
        if not ig_id:
            print("[-] META_IG_USER_ID is required to post to Instagram. Add it to .env.")
            sys.exit(1)
        if not args.image_url:
            print("[-] --image_url is required for Instagram image posting.")
            sys.exit(1)
        post_to_instagram(ig_id, token, args.image_url, args.message or "")

if __name__ == "__main__":
    main()
