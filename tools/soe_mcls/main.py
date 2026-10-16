import uuid
from typing import List, Optional
from fastapi import FastAPI
from pydantic import BaseModel
from soe_mcls.canon import PRODUCT_LADDER, CULTURAL_DELTAS, PRODUCTION_CAMPAIGNS
from soe_mcls.meta_launcher import MetaCampaignLauncher
from soe_mcls.funnel_engine import FunnelCheckoutService
from soe_mcls.capi_brevo_sync import TelemetrySyncEngine
from soe_mcls.rhythm_guardian import RhythmGuardianOptimizer

app = FastAPI(title="SOE Market Campaign Launch System (SOE-MCLS)", version="1.0.0")

launcher = MetaCampaignLauncher(dry_run=True)
funnel_service = FunnelCheckoutService(mock_mode=True)
sync_engine = TelemetrySyncEngine()
guardian = RhythmGuardianOptimizer()

class CampaignLaunchRequest(BaseModel):
    campaign_key: str
    delta_key: str
    daily_budget_cents: int = 5000
    buyer_track: str = "D2C"
    language: str = "en"
    archetype_ids: List[str] = ["ARC-01", "ARC-02", "ARC-03"]
    engine_type: str = "ENGINE_A_VALUE_GATE"

class ListenCaptureRequest(BaseModel):
    email: str
    first_name: str
    delta: str = "SCREEN_VS_SENSORY"
    buyer_track: str = "D2C"
    include_starter_pack_bump: bool = False
    child_age_bracket: Optional[str] = None
    phone: Optional[str] = None
    first_touch_ad_id: Optional[str] = None
    fbc: Optional[str] = None
    fbp: Optional[str] = None

class UpsellChargeRequest(BaseModel):
    customer_id: str
    payment_method_id: str
    sku_key: str

@app.get("/api/v1/canon")
def get_canon_state():
    return {
        "deltas": CULTURAL_DELTAS,
        "campaigns": PRODUCTION_CAMPAIGNS,
        "product_ladder": PRODUCT_LADDER,
    }

@app.post("/api/v1/campaigns/launch")
def launch_meta_campaign(req: CampaignLaunchRequest):
    bundle = launcher.prepare_full_campaign_launch(
        campaign_key=req.campaign_key,
        delta_key=req.delta_key,
        daily_budget_cents=req.daily_budget_cents,
        buyer_track=req.buyer_track,
        language=req.language,
        archetype_ids=req.archetype_ids,
        engine_type=req.engine_type,
    )
    return {"status": "READY_TO_DISPATCH", "bundle": bundle}

@app.post("/api/v1/funnel/listen-capture")
def capture_listen_lead(req: ListenCaptureRequest):
    event_id = f"evt_{uuid.uuid4().hex[:12]}"
    event_name = "InitiateCheckout" if req.include_starter_pack_bump else "Lead"
    val_cents = 700 if req.include_starter_pack_bump else 0

    capi_payload = sync_engine.build_meta_capi_payload(
        event_name=event_name,
        email=req.email,
        event_id=event_id,
        source_url="https://soelearn.com/listen",
        value_cents=val_cents,
        phone=req.phone,
        fbc=req.fbc,
        fbp=req.fbp,
    )

    brevo_payload = sync_engine.build_brevo_contact_payload(
        email=req.email,
        first_name=req.first_name,
        buyer_track=req.buyer_track,
        delta=req.delta,
        purchased_skus=["soe_free_19_album"],
        child_age_bracket=req.child_age_bracket,
        phone=req.phone,
        first_touch_ad_id=req.first_touch_ad_id,
    )

    stripe_intent = None
    if req.include_starter_pack_bump:
        stripe_intent = funnel_service.create_vaulted_checkout_intent(
            email=req.email,
            sku_key="STARTER_PACK",
            delta=req.delta,
            first_touch_ad_id=req.first_touch_ad_id,
        )

    return {
        "status": "CAPTURED",
        "album_stream_unlocked": True,
        "capi_event": capi_payload,
        "brevo_sync": brevo_payload,
        "stripe_intent": stripe_intent,
    }

@app.post("/api/v1/funnel/charge-upsell")
def charge_vaulted_upsell(req: UpsellChargeRequest):
    charge = funnel_service.charge_vaulted_upsell(
        customer_id=req.customer_id,
        payment_method_id=req.payment_method_id,
        sku_key=req.sku_key,
    )
    return {"status": "CHARGED", "charge": charge}
