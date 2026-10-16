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
