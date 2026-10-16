import pytest
from soe_mcls.funnel_engine import FunnelCheckoutService
from soe_mcls.capi_brevo_sync import TelemetrySyncEngine

def test_capi_payload_hashing_and_formatting():
    sync = TelemetrySyncEngine()
    payload = sync.build_meta_capi_payload(
        event_name="Lead",
        email="Parent@Example.com ",
        phone="+1 (555) 234-5678",
        event_id="evt_12345",
        source_url="https://soelearn.com/listen?utm_campaign=the_enemy",
        value_cents=0,
        fbc="fb.1.1558571054389.IwAR0",
        fbp="fb.1.1558571054389.1098115397"
    )
    event = payload["data"][0]
    assert event["event_name"] == "Lead"
    assert event["event_id"] == "evt_12345"
    assert len(event["user_data"]["em"][0]) == 64
    assert event["user_data"]["fbc"] == "fb.1.1558571054389.IwAR0"

def test_stripe_starter_pack_vault_intent_spec():
    service = FunnelCheckoutService(mock_mode=True)
    intent = service.create_vaulted_checkout_intent(
        email="mother@soelearn.com",
        sku_key="STARTER_PACK",
        delta="screen_vs_sensory",
        first_touch_ad_id="ad_789012"
    )
    assert intent["amount"] == 700
    assert intent["currency"] == "usd"
    assert intent["setup_future_usage"] == "off_session"
    assert intent["metadata"]["sku"] == "soe_quest_starter_7"
    assert intent["metadata"]["first_touch_ad_id"] == "ad_789012"

def test_one_click_off_session_upsell():
    service = FunnelCheckoutService(mock_mode=True)
    charge = service.charge_vaulted_upsell(
        customer_id="cus_mock123",
        payment_method_id="pm_mock123",
        sku_key="WORKBOOK_PRINT"
    )
    assert charge["amount"] == 3500
    assert charge["off_session"] is True
    assert charge["confirm"] is True

def test_brevo_payload_with_2026_child_age_and_first_touch():
    sync = TelemetrySyncEngine()
    payload = sync.build_brevo_contact_payload(
        email="parent@soelearn.com",
        first_name="Marcus",
        buyer_track="D2C",
        delta="algorithm_vs_handcrafted",
        purchased_skus=["soe_free_19_album"],
        child_age_bracket="Ages 4–5",
        phone="+15551234567",
        first_touch_ad_id="ad_test_123"
    )
    assert payload["attributes"]["CHILD_AGE_BRACKET"] == "Ages 4–5"
    assert payload["attributes"]["FIRST_TOUCH_AD_ID"] == "ad_test_123"
    assert "FIRST_TOUCH_TIMESTAMP" in payload["attributes"]
