"""
The Sound of Essentials: Rhythm Quest — Facebook Page Seed Engine
Automated seeding and publishing engine for Facebook Page (ID: 1238685869335542)
via Meta Graph API v21.0 with native local image multipart uploads.

Supports both:
  1. Organic Seed Posts (7-post foundational launch sequence)
  2. Long-Form Editorial Advertorial Posts (5 full-length high-converting story posts)

Usage:
  python tools/seed_facebook_page.py --status
  python tools/seed_facebook_page.py --export
  python tools/seed_facebook_page.py --type advertorials --publish --dry-run
  python tools/seed_facebook_page.py --type advertorials --publish [--token <FRESH_TOKEN>]
  python tools/seed_facebook_page.py --type advertorials --publish-single <1-5>
  python tools/seed_facebook_page.py --type seed --publish --dry-run
"""

import os
import sys
import json
import csv
import argparse
from pathlib import Path

# Fix Windows console UTF-8 output encoding for emojis
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

try:
    import requests
except ImportError:
    print("[-] 'requests' package is required. Install via: pip install requests", file=sys.stderr)
    sys.exit(1)

# Paths
REPO_ROOT = Path(__file__).resolve().parent.parent
WORKSPACE_ROOT = REPO_ROOT.parent
ENV_FILE = REPO_ROOT / ".env"
SEED_EXPORT_JSON = REPO_ROOT / "docs" / "facebook_seed_catalog.json"
SEED_EXPORT_CSV = REPO_ROOT / "docs" / "facebook_seed_catalog.csv"
ADV_EXPORT_JSON = REPO_ROOT / "docs" / "facebook_advertorials_catalog.json"
ADV_EXPORT_CSV = REPO_ROOT / "docs" / "facebook_advertorials_catalog.csv"

def load_env():
    env_vars = {}
    if ENV_FILE.exists():
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env_vars[k.strip()] = v.strip().strip('"').strip("'")
    return env_vars

ENV = load_env()
GRAPH_API_VERSION = "v21.0"
BASE_URL = f"https://graph.facebook.com/{GRAPH_API_VERSION}"

# Canonical 7-Post Launch Seeding Matrix
SEED_POSTS = [
    {
        "post_num": 1,
        "is_pinned": True,
        "theme": "The Flagship Origin Story & $0 Free Album Gift",
        "delta": "Institutional Injustice & Founder Vulnerability",
        "headline": "Why We Built What The School System Took Away 🎵💛",
        "image_file": WORKSPACE_ROOT / "ad-origin-story_square.png",
        "link": "https://soelearn.com/listen",
        "copy": (
            "To every parent trying to build a peaceful, screen-free morning routine:\n\n"
            "A while back, I watched my children's school cut their music and arts program. "
            "Not because the kids didn't love it, and not because it wasn't working. But simply because music "
            "wasn't on the standardized testing grid.\n\n"
            "It broke my heart. Music isn't an elective for a 4-year-old—it's the neurological foundation "
            "of how their developing brain learns to count, decode phonics, and regulate their nervous system.\n\n"
            "Guided by a father's heart and a mother's love, we spent years building what the schools took away. "
            "We created The Sound of Essentials: Rhythm Quest—19 originally published acoustic songs recorded live "
            "in studio sessions with authentic human vocals, covering phonics, math, movement, emotional regulation, "
            "and nature across 7 imaginary lands for ages 2–7.\n\n"
            "We decided to make the complete 19-track album 100% free for families everywhere. No subscription, "
            "no app download, and zero algorithmic screen traps.\n\n"
            "👉 Stream and claim the full 19-track album free right now: https://soelearn.com/listen\n\n"
            "May it bring peace, singing, and joy to your mornings!\n\n"
            "#TheSoundOfEssentials #RhythmQuest #ScreenFreeKids #HomeschoolMorning #EarlyLiteracy #CalmParenting"
        )
    },
    {
        "post_num": 2,
        "is_pinned": False,
        "theme": "The Sound-Before-Symbol Phonics Breakthrough",
        "delta": "Screen vs. Sensory",
        "headline": "Why Letter Tracing Worksheets Fail (And What to Do Instead) 📖✨",
        "image_file": WORKSPACE_ROOT / "auditory_ear_before_print.jpg",
        "link": "https://soelearn.com/listen",
        "copy": (
            "Quick early literacy insight for parents of 3 to 6-year-olds:\n\n"
            "If your child resists tracing letters, avoids flashcards, or melts down over phonics worksheets, "
            "it's not because they lack focus. It's because early education often forces 'Symbol-First' learning "
            "before the brain is ready.\n\n"
            "In early cognitive development, the ear decodes rhythm, cadence, and syllables months before the eye "
            "can comfortably track abstract 2D shapes on a page. When children internalize the pulse of beginning "
            "sounds through rhythmic call-and-response echo songs, reading unlocks naturally.\n\n"
            "That's why The Sound of Essentials starts with sound, not screens. Through 19 handcrafted story songs, "
            "children hear phonics in their bodies before they ever pick up a pencil.\n\n"
            "Experience the difference with your little one today:\n"
            "👉 Stream all 19 tracks free at https://soelearn.com/listen\n\n"
            "#SoundBeforeSymbol #EarlyLiteracy #MontessoriAtHome #PreschoolReading #ScreenFreeLearning"
        )
    },
    {
        "post_num": 3,
        "is_pinned": False,
        "theme": "Welcome to the 7 Lands & 15 Heroes of Rhythm Quest",
        "delta": "Consumption vs. Quest",
        "headline": "Welcome to Rhythm Quest: 7 Living Lands Designed for the Developing Brain 🗺️🛡️",
        "image_file": WORKSPACE_ROOT / "ad11_seven_lands_globe_canon.png",
        "link": "https://soelearn.com/listen",
        "copy": (
            "Step outside the algorithmic rabbit holes and step into a continuous story world.\n\n"
            "Under the guidance of Seriphia, Guardian of the Sound, your child journeys through 7 musical lands "
            "designed specifically for ages 2–7 (Pre-K to Grade 2):\n\n"
            "🌸 Harmonia (Kenji & Aiko) — Beginning phonics, rhythm echo, and polite manners\n"
            "🔢 Numeria (Kwame & Octavia) — 1–20 rhythmic counting, patterns, and geometric shapes\n"
            "⚡ Vitalis (Felix & Amara) — Cross-body motor coordination, somatic movement, and healthy nutrition\n"
            "⭐ Celestia (Elias & Selene) — Solar observation, passage of time, and wonder of the cosmos\n"
            "💡 Luminosity (Athena & Ezra) — Bilingual French songs, inquisitive science, and light\n"
            "🌊 Aquaria (Nerissa & Ronan) — Calming breathing tempos, water stewardship, and emotional regulation\n"
            "🌿 Terrasol (Vesta & Silas) — Four seasons, animal tracking, and connection to the living earth\n\n"
            "No bright pings. No addictive variable rewards. Just beautiful music and wholesome mentors.\n\n"
            "👉 Start your quest free today: https://soelearn.com/listen\n\n"
            "#RhythmQuest #7Lands #CharacterEducation #WholesomeKids #ScreenFreeChildhood"
        )
    },
    {
        "post_num": 4,
        "is_pinned": False,
        "theme": "Track Spotlight: Hello, 7 Lands! (Track 1) & Morning Circle Time",
        "delta": "Testing vs. Arts",
        "headline": "Meet Track 1: 'Hello, 7 Lands!' — The 3-Minute Morning Reset 🎵☀️",
        "image_file": WORKSPACE_ROOT / "The Sound of Essentials album cover.png",
        "link": "https://soelearn.com/listen",
        "copy": (
            "Tired of morning overwhelm, rushed breakfast tables, and screen negotiations?\n\n"
            "Here is a simple 3-minute shift: Press play on Track 1 of Rhythm Quest ('Hello, 7 Lands!') "
            "while pouring breakfast.\n\n"
            "Recorded live in studio sessions with authentic human vocals and warm acoustic arrangements, "
            "this opening track sets an unhurried, neuro-affirming tempo that gently wakes up developing nervous systems.\n\n"
            "Children instinctively start swaying, humming along, and centering their focus—no shouting, no screen bargaining.\n\n"
            "Try it in your kitchen or classroom tomorrow morning:\n"
            "👉 Stream the entire 19-track album free: https://soelearn.com/listen\n\n"
            "#MorningRoutine #PreschoolCircleTime #CalmMornings #KidsMusic #SensoryFriendly"
        )
    },
    {
        "post_num": 5,
        "is_pinned": False,
        "theme": "Tactile Companions: The Picture Dictionary & Readiness Workbook",
        "delta": "Algorithm vs. Handcrafted",
        "headline": "Real Books for Little Hands: 4,232 Words & 400 Tactile Quests 📚✍️",
        "image_file": WORKSPACE_ROOT / "rhythm-ready-workbook-cover.png",
        "link": "https://soelearn.com/shop",
        "copy": (
            "What happens when the music stops?\n\n"
            "That's when little fingers turn the page. The Sound of Essentials ecosystem pairs our 19 acoustic songs "
            "with tactile, screen-free physical tools:\n\n"
            "📖 The Essential Picture Dictionary — 4,232 rich vocabulary words across 157 illustrated storybook scenes. "
            "Children search, point, and name real objects without a single blue-light pixel.\n\n"
            "✏️ The 40-Day Rhythm Ready Workbook — 10 daily micro-blocks (just 15–20 minutes/day) featuring rhyming games, "
            "rhythmic clapping, tracing paths, and nature observations.\n\n"
            "When songs and real paper meet, literacy isn't a chore—it becomes their favorite part of the day.\n\n"
            "Explore our tactile learning companions:\n"
            "👉 Discover the physical collection: https://soelearn.com/shop\n"
            "👉 (And stream all 19 songs free at https://soelearn.com/listen)\n\n"
            "#PictureDictionary #HandsOnLearning #TactileLearning #CharlotteMasonHomeschool #MontessoriBooks"
        )
    },
    {
        "post_num": 6,
        "is_pinned": False,
        "theme": "Educator & Classroom Authority: The 16-Minute Daily Rhythm",
        "delta": "Institution vs. Sanctuary",
        "headline": "For Teachers & Homeschool Co-ops: The 16-Minute Morning Circle Framework 🍎🌿",
        "image_file": WORKSPACE_ROOT / "ad04_seriphia_classroom_canon.png",
        "link": "https://soelearn.com/listen",
        "copy": (
            "To our early childhood educators and homeschool directors:\n\n"
            "Finding circle time resources that don't overstimulate little nervous systems is an everyday challenge. "
            "Commercial cartoon music is often high-pitched, frenetic, and sensory-jarring.\n\n"
            "Here is the 16-minute micro-block routine educators are using across the country:\n"
            "1️⃣ Word Detectives (3 min): Phonics echo song in Harmonia\n"
            "2️⃣ Number Hunt (3 min): Rhythmic counting claps 1–20 in Numeria\n"
            "3️⃣ Garden Secrets (3 min): Nature inquiry & weather observation\n"
            "4️⃣ Wake-Up Movement (4 min): Somatic stretching in Vitalis\n"
            "5️⃣ Calming Reflection (3 min): Breathing tempo in Aquaria\n\n"
            "Total time: 16 calm, focused minutes. Children are grounded, engaged, and ready to learn.\n\n"
            "We provide the entire 19-track album 100% free for classroom streaming (no paywall):\n"
            "👉 Stream free for your classroom: https://soelearn.com/listen\n\n"
            "#ECE #PreKTeacher #KindergartenTeacher #CircleTime #ClassroomManagement #SensoryDiet"
        )
    },
    {
        "post_num": 7,
        "is_pinned": False,
        "theme": "Parent Discussion & Community Sanctuary",
        "delta": "Sanctuary Home & Community Engagement",
        "headline": "Parents: What's Your Biggest Screen-Time Struggle Right Now? 💬💛",
        "image_file": WORKSPACE_ROOT / "hero_sanctuary_home.jpg",
        "link": "https://soelearn.com/listen",
        "copy": (
            "Be honest: How many times this week did a 'quick 15-minute educational video' turn into a full meltdown "
            "when it was time to turn it off?\n\n"
            "You are not alone. And it is NOT your fault.\n\n"
            "Modern children's media is engineered by attention economists using variable dopamine loops. "
            "When kids watch them, their bodies enter a fight-or-flight freeze. The meltdown isn't defiance—it's their "
            "nervous system trying to regulate after extreme sensory stimulation.\n\n"
            "In our home, replacing screens with story-driven acoustic music changed everything. The room goes quiet. "
            "Imagination takes over. And when the song finishes, they're calm—not rattling.\n\n"
            "💬 Drop a comment below: What has been your family's biggest win (or biggest hurdle) in reducing screen time?\n\n"
            "If you need a gentle reset this evening, our 19-track learning album is waiting for you free:\n"
            "👉 Stream free: https://soelearn.com/listen\n\n"
            "#SanctuaryHome #MindfulParenting #GentleParenting #ScreenFreeParenting #PeacefulHome"
        )
    }
]

# Canonical 5 Long-Form Editorial Advertorial Posts for Facebook
ADVERTORIAL_POSTS = [
    {
        "post_num": 1,
        "is_pinned": False,
        "theme": "Flagship Screen vs. Sensory Advertorial (Mom Perspective)",
        "headline": "More Moms Are Pulling Their Kids Off the Apps for a Quieter Way to Learn to Read 🎵👇",
        "image_file": WORKSPACE_ROOT / "auditory_ear_before_print.jpg",
        "link": "https://thesoundofessentials.com/story",
        "copy": (
            "More moms are pulling their kids off the apps for a quieter way to learn to read — and it starts with sound, not screens. 🎵👇\n\n"
            "You handed over the tablet so she could learn her letters.\n\n"
            "Ten minutes in, you glance over — and she’s not learning anything. She’s slack-jawed, thumbs twitching, "
            "eyes locked on a screen that flashes and chimes and never once pauses.\n\n"
            "You know that face. Every mom does. That’s the face that says the app has her now, and getting it back will mean a meltdown.\n\n"
            "Why does the calm never seem to last?\n"
            "You set limits: twenty minutes, then off. But the twenty minutes end in tears, and the rest of the afternoon feels rattled — "
            "like something wound her up and left her nowhere to put it.\n\n"
            "Here’s the part that stings: The app *promised* learning. Bright colors, cheerful voices, a little trophy every few taps. "
            "It looks like your child is learning. But watch closely and you’ll notice she isn’t building anything. She’s chasing the next flash of reward.\n\n"
            "Scientists have a plain name for what that trains: the dopamine loop. In a child's first years, the brain forms over 1,000,000 new neural connections "
            "every second. What you feed it now, it wires in permanently. Fast, flashing rewards wire in one thing: the itch for more stimulation.\n\n"
            "The fix isn't more screen time or a 'better' app. It's stepping out of the loop entirely — and starting where reading actually begins: Sound, not screens.\n\n"
            "Instead of a screen chasing her attention, there are songs. Nineteen of them. Originally published music — nineteen master tracks recorded live "
            "in studio sessions with authentic human vocals and warm acoustic arrangements — no autoplay, no ads, no tracking, and nothing designed to keep her hooked. "
            "These are calm, whole stories designed for your child to move and sing along to for ages 2–7.\n\n"
            "A child hearing it for the first time doesn't zone out. Instead, she leans in. And when the song ends, she isn't fried — she's calm, and she's learned something that lasts.\n\n"
            "📖 Read our full story and parent breakdown:\n"
            "👉 https://thesoundofessentials.com/story\n\n"
            "🎵 Stream all 19 tracks free right now:\n"
            "👉 https://soelearn.com/listen\n\n"
            "#TheSoundOfEssentials #SoundBeforeSymbol #ScreenFreeParenting #EarlyLiteracy #CalmMornings #MontessoriAtHome"
        )
    },
    {
        "post_num": 2,
        "is_pinned": False,
        "theme": "Sing-Along Time & Emotional Regulation Advertorial",
        "headline": "Why Parents Are Trading Screen Time for Sing-Along Time — And Watching Their Kids Grow Kinder 💛🎶",
        "image_file": WORKSPACE_ROOT / "dad_child_singing.jpg",
        "link": "https://thesoundofessentials.com/sing-along-time",
        "copy": (
            "Why parents are trading screen time for sing-along time — and watching their kids grow kinder. 💛🎶\n\n"
            "It's the small handoff a lot of parents know by heart: The tablet goes down for dinner after an hour of daily screen time, "
            "and the room tips over.\n\n"
            "There are tears, a slammed chair, a fight over who sits where. A quiet thought lands in the chest: When did everything get so hard?\n\n"
            "It isn't that your child is difficult or you're doing it wrong. Tablet screens promise a break, and for twenty minutes they deliver one. "
            "Then the tablet clicks off, and everything the screen was holding down comes rushing back — louder. The calm from screen time was borrowed, not built.\n\n"
            "Call this 'The Closeness Gap': Learning apps miss the core piece during early childhood. Kindness, patience, and taking turns aren't facts "
            "you hand a child through a glass panel. They are learned in the back-and-forth between two people.\n\n"
            "Music closes that gap.\n"
            "When you sing call-and-response echo songs, your child waits and answers — that's turn-taking.\n"
            "When you keep an acoustic beat together, two nervous systems fall into the same tempo, and a wound-up little body learns what settling down feels like.\n\n"
            "We built The Sound of Essentials: Rhythm Quest around 19 originally published acoustic songs and 15 mentor characters across 7 living lands "
            "to give families their living rooms back.\n\n"
            "📖 Read the full feature on closing the closeness gap:\n"
            "👉 https://thesoundofessentials.com/sing-along-time\n\n"
            "🎵 Stream all 19 songs 100% free with your little ones tonight:\n"
            "👉 https://soelearn.com/listen\n\n"
            "#SingAlongTime #EmotionalRegulation #ParentingPeace #GentleParenting #ScreenFreeChildhood #SensorySanctuary"
        )
    },
    {
        "post_num": 3,
        "is_pinned": False,
        "theme": "The Sovereign Child: Living Room Sanctuary & Education Sovereignty",
        "headline": "The Sovereign Child: Returning Early Learning to the Living Room Sanctuary 🌿🏡",
        "image_file": WORKSPACE_ROOT / "hero_sanctuary_home.jpg",
        "link": "https://thesoundofessentials.com/education-sovereignty",
        "copy": (
            "The Sovereign Child: Why families are returning early learning from institutional testing grids back to the living room sanctuary. 🌿🏡\n\n"
            "For decades, parents were told that earlier testing, standardized benchmarks, and screen-delivered drills were the only way "
            "to prepare a 4-year-old for the future.\n\n"
            "The result? A national childhood mental health crisis, fragmented attention spans, and preschool music and arts programs stripped down "
            "because they didn't generate data for a spreadsheet.\n\n"
            "Education sovereignty begins when parents realize: The developing brain was never built for an algorithmic conveyor belt.\n\n"
            "In Charlotte Mason's classical tradition, early childhood belongs to living rhythms, acoustic beauty, rich vocabulary, and the wonder of nature. "
            "A child doesn't learn phonics by staring at a silent 2D flashcard; they learn it when sound enters their ear and rhythm enters their feet.\n\n"
            "Guided by a father's heart and a mother's love, The Sound of Essentials restores what was taken: an entire early learning world designed "
            "for ages 2–7 with zero blue-light screens, zero data harvesting, and 19 master acoustic tracks that build phonics, numbers, and emotional peace.\n\n"
            "📖 Read our in-depth Education Sovereignty manifesto:\n"
            "👉 https://thesoundofessentials.com/education-sovereignty\n\n"
            "🎵 Reclaim your family's morning rhythm with our free 19-track album:\n"
            "👉 https://soelearn.com/listen\n\n"
            "#EducationSovereignty #Homeschooling #CharlotteMason #ClassicalEducation #ScreenFreeLiving #LivingRoomSanctuary"
        )
    },
    {
        "post_num": 4,
        "is_pinned": False,
        "theme": "Global Learn English / Bilingual Phonics Breakthrough",
        "headline": "Why Early Language Apps Leave Children Silent: The Acoustic Foundation 🌍🗣️",
        "image_file": WORKSPACE_ROOT / "hook_global_story.jpg",
        "link": "https://thesoundofessentials.com/global-learn-english",
        "copy": (
            "Why early language apps leave children silent: Starting with the ear before the screen. 🌍🗣️\n\n"
            "Ever watched a child use a 'Learn English' tablet app for months—tapping words, dragging letters, collecting digital stars—"
            "yet when it's time to speak in real life, they go completely quiet?\n\n"
            "You are not alone. And the reason is neurological.\n\n"
            "Tapping a glass screen exercises fine-motor finger muscles, but it bypasses the auditory-vocal loop. "
            "A young child does not absorb human language through silent visual gamification. During the brain's critical 1,000-day window, "
            "speech is encoded through acoustic resonance, melodic cadence, and physical vocal mimicry.\n\n"
            "When words are anchored in musical rhythm, the child's brain doesn't have to translate — it mirrors.\n\n"
            "Through 19 originally published acoustic songs and our bilingual journey into Luminosity (featuring French and English call-and-response), "
            "children absorb early pronunciation, cadence, and vocabulary with natural confidence.\n\n"
            "📖 Read the full global language development report:\n"
            "👉 https://thesoundofessentials.com/global-learn-english\n\n"
            "🎵 Stream the complete acoustic learning album free:\n"
            "👉 https://soelearn.com/listen\n\n"
            "#LearnEnglish #BilingualKids #EarlyLanguage #AcousticLearning #ESLParents #AuditoryDevelopment"
        )
    },
    {
        "post_num": 5,
        "is_pinned": False,
        "theme": "Skeptical Dad Listicle: I Spent $240 on Reading Apps",
        "headline": "I Spent $240 on 'Top-Rated' Reading Apps. Here Are 5 Reasons I Deleted Every Single One 📱❌",
        "image_file": WORKSPACE_ROOT / "dad_dinner_meltdown.jpg",
        "link": "https://thesoundofessentials.com/story",
        "copy": (
            "I spent $240 on 'top-rated' reading apps for my 4-year-old. Here are the 5 reasons I deleted every single one. 📱❌\n\n"
            "Like a lot of dads, I wanted to give my kid an advantage. The ads said: 'Top-Rated by Teachers,' 'Guaranteed Reading in 30 Days.' "
            "I handed over the iPad, set up the monthly subscriptions, and patted myself on the back.\n\n"
            "Six months later, I pulled the plug. Here's why:\n\n"
            "1. Tapping isn't reading. She wasn't decoding letters; she was guessing where the next shiny coin would drop.\n"
            "2. The post-screen meltdown. Every 20-minute session ended in tears, irritability, and a rattled afternoon.\n"
            "3. The dopamine slot machine. The apps are built on variable reward loops designed to extract attention, not build patience.\n"
            "4. It killed our connection. The app kept her busy, but we weren't doing anything together.\n"
            "5. It forced the eye before the ear. Science shows the ear decodes rhythm and phonics months before the eye can comfortably track letters.\n\n"
            "We swapped the iPad for The Sound of Essentials: Rhythm Quest — 19 original story songs recorded live in studio sessions, "
            "paired with a hands-on physical Picture Dictionary. No screens. No subscriptions. Just real music and real paper.\n\n"
            "Within three weeks, she was singing letter sounds while building Legos, and our afternoons are finally peaceful.\n\n"
            "📖 Read the full field report:\n"
            "👉 https://thesoundofessentials.com/story\n\n"
            "🎵 Test the music with your kids free tonight:\n"
            "👉 https://soelearn.com/listen\n\n"
            "#DadLife #ScreenFreeKids #RealBooks #HonestParenting #EarlyLiteracy #RhythmQuest"
        )
    }
]

def verify_meta_connection(token: str, page_id: str):
    """Verifies token against /me and /{page_id}."""
    print(f"[*] Verifying Meta API connection for Page ID: {page_id}...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        r_me = requests.get(f"{BASE_URL}/me", params={"fields": "id,name"}, headers=headers, timeout=10)
        me_json = r_me.json()
        if "error" in me_json:
            err = me_json["error"]
            print(f"[-] Token Validation Failed ({r_me.status_code}):", file=sys.stderr)
            print(f"    Message: {err.get('message')}", file=sys.stderr)
            print(f"    Code: {err.get('code')}, Subcode: {err.get('error_subcode')}", file=sys.stderr)
            return False, err
        print(f"[+] Token Identity: {me_json.get('name')} (ID: {me_json.get('id')})")
    except Exception as e:
        print(f"[-] Network connection error: {e}", file=sys.stderr)
        return False, str(e)

    try:
        r_page = requests.get(f"{BASE_URL}/{page_id}", params={"fields": "id,name,category,link"}, headers=headers, timeout=10)
        page_json = r_page.json()
        if "error" in page_json:
            print(f"[!] Warning: Token could not query Page {page_id} directly:")
            print(f"    {page_json['error'].get('message')}")
        else:
            print(f"[+] Connected to Facebook Page: '{page_json.get('name')}' (Category: {page_json.get('category')})")
    except Exception as e:
        print(f"[!] Warning on Page query: {e}")

    return True, me_json

def export_catalogs():
    """Exports both Seed Posts and Advertorial Posts to JSON and CSV."""
    SEED_EXPORT_JSON.parent.mkdir(parents=True, exist_ok=True)
    
    # 1. Seed Posts Exports
    with open(SEED_EXPORT_JSON, "w", encoding="utf-8") as f:
        json_data = [{
            "post_num": p["post_num"],
            "is_pinned": p.get("is_pinned", False),
            "theme": p["theme"],
            "headline": p["headline"],
            "image_path": str(p["image_file"]),
            "image_exists": p["image_file"].exists(),
            "link": p["link"],
            "copy": p["copy"]
        } for p in SEED_POSTS]
        json.dump(json_data, f, indent=2, ensure_ascii=False)

    with open(SEED_EXPORT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Post_Number", "Is_Pinned", "Theme", "Headline", "Image_Path", "Link", "Copy"])
        for p in SEED_POSTS:
            writer.writerow([p["post_num"], p.get("is_pinned", False), p["theme"], p["headline"], str(p["image_file"]), p["link"], p["copy"]])

    # 2. Advertorial Posts Exports
    with open(ADV_EXPORT_JSON, "w", encoding="utf-8") as f:
        adv_json_data = [{
            "post_num": p["post_num"],
            "theme": p["theme"],
            "headline": p["headline"],
            "image_path": str(p["image_file"]),
            "image_exists": p["image_file"].exists(),
            "link": p["link"],
            "copy": p["copy"]
        } for p in ADVERTORIAL_POSTS]
        json.dump(adv_json_data, f, indent=2, ensure_ascii=False)

    with open(ADV_EXPORT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Post_Number", "Theme", "Headline", "Image_Path", "Link", "Copy"])
        for p in ADVERTORIAL_POSTS:
            writer.writerow([p["post_num"], p["theme"], p["headline"], str(p["image_file"]), p["link"], p["copy"]])

    print(f"[+] Catalogs updated:")
    print(f"    - Seed JSON: {SEED_EXPORT_JSON.name} | CSV: {SEED_EXPORT_CSV.name}")
    print(f"    - Advertorials JSON: {ADV_EXPORT_JSON.name} | CSV: {ADV_EXPORT_CSV.name}")

def publish_post_to_facebook(page_id: str, token: str, post_data: dict, dry_run: bool = False, post_type: str = "Post"):
    """Publishes a single post with local image upload via multipart form-data."""
    img_path = post_data["image_file"]
    headline = post_data["headline"]
    copy_text = post_data["copy"]
    num = post_data["post_num"]
    pinned_badge = " [FLAGSHIP PINNED]" if post_data.get("is_pinned") else ""

    print(f"\n==================================================")
    print(f"[*] Processing {post_type} #{num}{pinned_badge}: {headline}")
    print(f"    Image: {img_path.name} (Exists: {img_path.exists()})")

    if not img_path.exists():
        print(f"[-] Error: Image file not found: {img_path}", file=sys.stderr)
        return False

    if dry_run:
        print(f"[DRY-RUN] Simulating publish to Facebook Page Graph API...")
        print(f"[DRY-RUN] Target Endpoint: POST {BASE_URL}/{page_id}/photos")
        print(f"[DRY-RUN] Image Size: {img_path.stat().st_size:,} bytes")
        print(f"[DRY-RUN] First 140 chars of copy:\n{copy_text[:140]}...\n")
        print(f"[+] [DRY-RUN] {post_type} #{num} validated and staged successfully!")
        return True

    # Real Graph API Multipart Publish
    url = f"{BASE_URL}/{page_id}/photos"
    try:
        with open(img_path, "rb") as img_file:
            files = {"source": (img_path.name, img_file, "image/png" if img_path.suffix == ".png" else "image/jpeg")}
            data = {
                "access_token": token,
                "caption": copy_text,
                "published": "true"
            }
            res = requests.post(url, data=data, files=files, timeout=60)
            res_json = res.json()
            if "id" in res_json:
                post_id = res_json.get("post_id", res_json["id"])
                print(f"[+] Successfully published to Facebook! Photo ID: {res_json['id']} | Post ID: {post_id}")
                return True
            else:
                print(f"[-] Facebook API Error: {res_json}", file=sys.stderr)
                return False
    except Exception as e:
        print(f"[-] Exception while publishing: {e}", file=sys.stderr)
        return False

def print_token_help():
    print("""
================================================================================
ℹ️ HOW TO GENERATE OR REFRESH YOUR FACEBOOK PAGE ACCESS TOKEN (2 MINUTES):
================================================================================
1. Go to Meta Graph API Explorer:
   👉 https://developers.facebook.com/tools/explorer/
2. In the top-right corner:
   - Select your Meta App.
   - Under 'User or Page', select your Facebook Page:
     'The Sound of Essentials' (ID: 1238685869335542)
3. Ensure the following permissions are checked:
   - pages_show_list
   - pages_read_engagement
   - pages_manage_posts
4. Click 'Generate Access Token'.
5. Publish immediately:
   python tools/seed_facebook_page.py --type advertorials --token YOUR_TOKEN --publish
================================================================================
""")

def main():
    parser = argparse.ArgumentParser(description="SOE Facebook Page Seed & Advertorial Engine")
    parser.add_argument("--type", choices=["seed", "advertorials", "all"], default="seed", help="Content type to publish")
    parser.add_argument("--status", action="store_true", help="Check Meta API connection & credentials")
    parser.add_argument("--export", action="store_true", help="Export catalogs to JSON and CSV")
    parser.add_argument("--publish", action="store_true", help="Publish selected posts to Facebook")
    parser.add_argument("--publish-single", type=int, help="Publish a specific post number")
    parser.add_argument("--dry-run", action="store_true", help="Simulate publish without sending live requests")
    parser.add_argument("--token", help="Override Meta Access Token from CLI")
    parser.add_argument("--page-id", help="Override Facebook Page ID from CLI")
    args = parser.parse_args()

    token = args.token or os.getenv("META_PAGE_ACCESS_TOKEN") or ENV.get("META_PAGE_ACCESS_TOKEN") or os.getenv("META_ACCESS_TOKEN") or ENV.get("META_ACCESS_TOKEN")
    page_id = args.page_id or os.getenv("META_PAGE_ID") or ENV.get("META_PAGE_ID") or "1238685869335542"

    export_catalogs()

    if args.status:
        if not token:
            print("[-] No Meta token provided. Set META_PAGE_ACCESS_TOKEN in .env or pass --token.")
            print_token_help()
            sys.exit(1)
        valid, _ = verify_meta_connection(token, page_id)
        if not valid:
            print_token_help()
        sys.exit(0 if valid else 1)

    if args.publish or args.publish_single:
        if not args.dry_run:
            if not token:
                print("[-] No token found. Run with --dry-run or provide --token.")
                print_token_help()
                sys.exit(1)
            valid, _ = verify_meta_connection(token, page_id)
            if not valid:
                print("\n[!] Cannot proceed with live publish until a valid token is provided.")
                print("[!] You can test with --dry-run in the meantime:")
                print("    python tools/seed_facebook_page.py --type advertorials --publish --dry-run")
                print_token_help()
                sys.exit(1)

        target_pool = []
        if args.type in ("seed", "all"):
            target_pool.extend([("Seed Post", p) for p in SEED_POSTS])
        if args.type in ("advertorials", "all"):
            target_pool.extend([("Advertorial", p) for p in ADVERTORIAL_POSTS])

        if args.publish_single:
            target_pool = [item for item in target_pool if item[1]["post_num"] == args.publish_single]

        print(f"\n[*] Beginning Facebook Publishing ({len(target_pool)} {args.type} posts) for Page ID: {page_id}")
        success_count = 0
        for ptype, p in target_pool:
            ok = publish_post_to_facebook(page_id, token, p, dry_run=args.dry_run, post_type=ptype)
            if ok:
                success_count += 1

        print(f"\n[+] Publishing Process Complete! {success_count}/{len(target_pool)} posts successfully processed.")

if __name__ == "__main__":
    main()
