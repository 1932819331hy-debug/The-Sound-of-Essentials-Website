from fastapi.testclient import TestClient
from soe_mcls.main import app

client = TestClient(app)

def test_canon_endpoint():
    resp = client.get("/api/v1/canon")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["deltas"]) == 5
    assert len(data["campaigns"]) == 6
    assert data["product_ladder"]["FREE_ALBUM"]["price_cents"] == 0

def test_one_click_campaign_launch_endpoint():
    resp = client.post("/api/v1/campaigns/launch", json={
        "campaign_key": "VICTORY_GARDEN",
        "delta_key": "ALGORITHM_VS_HANDCRAFTED",
        "daily_budget_cents": 4500,
        "buyer_track": "D2C",
        "language": "en",
        "archetype_ids": ["ARC-01", "ARC-07"],
        "engine_type": "ENGINE_A_VALUE_GATE"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] in ["READY_TO_DISPATCH", "STAGED_SANDBOX"]
    assert len(data["bundle"]["ad_specs"]) == 2

def test_listen_funnel_progressive_lead_and_starter_pack_bump():
    resp = client.post("/api/v1/funnel/listen-capture", json={
        "email": "caregiver@soelearn.com",
        "first_name": "Elena",
        "delta": "SCREEN_VS_SENSORY",
        "include_starter_pack_bump": True,
        "child_age_bracket": "Ages 4–5",
        "phone": "+1 (555) 987-6543",
        "first_touch_ad_id": "ad_campaign_enemy_01"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["capi_event"]["data"][0]["event_name"] == "InitiateCheckout"
    assert data["stripe_intent"]["amount"] == 700
    assert data["stripe_intent"]["setup_future_usage"] == "off_session"
    assert data["stripe_intent"]["metadata"]["first_touch_ad_id"] == "ad_campaign_enemy_01"
    assert data["brevo_sync"]["attributes"]["CHILD_AGE_BRACKET"] == "Ages 4–5"
    assert data["brevo_sync"]["listIds"] == [101]

def test_one_click_upsell_endpoint():
    resp = client.post("/api/v1/funnel/charge-upsell", json={
        "customer_id": "cus_test_99",
        "payment_method_id": "pm_test_99",
        "sku_key": "WORKBOOK_PRINT"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "CHARGED"
    assert data["charge"]["amount"] == 3500
