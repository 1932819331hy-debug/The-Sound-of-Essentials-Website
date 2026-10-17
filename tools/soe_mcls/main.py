import os
import uuid
from typing import List, Optional, Dict, Any
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx
from soe_mcls.config import settings
from soe_mcls.canon import PRODUCT_LADDER, CULTURAL_DELTAS, PRODUCTION_CAMPAIGNS
from soe_mcls.meta_launcher import MetaCampaignLauncher
from soe_mcls.funnel_engine import FunnelCheckoutService
from soe_mcls.capi_brevo_sync import TelemetrySyncEngine
from soe_mcls.rhythm_guardian import RhythmGuardianOptimizer

app = FastAPI(title="SOE Market Campaign Launch System (SOE-MCLS)", version="1.0.0")

# Enable CORS for Vite frontend (localhost:5173 and production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Runtime Credential Store
RUNTIME_META_CONFIG = {
    "access_token": settings.META_ACCESS_TOKEN if settings.META_ACCESS_TOKEN != "mock_meta_token" else "",
    "ad_account_id": settings.META_AD_ACCOUNT_ID if settings.META_AD_ACCOUNT_ID != "act_000000000" else "",
    "page_id": settings.META_PAGE_ID if settings.META_PAGE_ID != "000000000000" else "",
    "pixel_id": settings.META_PIXEL_ID if settings.META_PIXEL_ID != "000000000000" else "",
}

launcher = MetaCampaignLauncher(dry_run=True)
funnel_service = FunnelCheckoutService(mock_mode=True)
sync_engine = TelemetrySyncEngine()
guardian = RhythmGuardianOptimizer()

class MetaCredentialsInput(BaseModel):
    access_token: str = Field(..., description="Meta System User or User Access Token")
    ad_account_id: str = Field(..., description="Meta Ad Account ID (e.g. act_123456789)")
    page_id: Optional[str] = Field("", description="Facebook Page ID")
    pixel_id: Optional[str] = Field("", description="Meta Pixel / Dataset ID")

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

@app.get("/api/v1/meta/status")
def get_meta_status():
    """Returns current Meta connection mode, credential status, and masked token."""
    token = RUNTIME_META_CONFIG.get("access_token", "")
    acct_id = RUNTIME_META_CONFIG.get("ad_account_id", "")
    is_live_configured = bool(token and acct_id and "mock" not in token.lower())
    
    clean_acct = acct_id.replace("act_", "") if acct_id else ""
    return {
        "mode": "LIVE_CONNECTED" if is_live_configured else "SANDBOX_DRY_RUN",
        "is_configured": is_live_configured,
        "ad_account_id": f"act_{clean_acct}" if clean_acct else "Not Connected (Sandbox Default)",
        "page_id": RUNTIME_META_CONFIG.get("page_id") or "Not Configured",
        "pixel_id": RUNTIME_META_CONFIG.get("pixel_id") or "Not Configured",
        "token_preview": f"{token[:8]}...{token[-4:]}" if len(token) > 16 else ("Configured (Mock)" if token else "None"),
        "graph_api_version": "v21.0",
        "notice": "All dispatches are staged safely in Sandbox Simulation mode until real Meta credentials are provided."
    }

@app.post("/api/v1/meta/verify")
async def verify_and_save_meta_credentials(creds: MetaCredentialsInput):
    """
    Validates Meta credentials against Meta Graph API v21.0.
    If valid, activates live mode; if invalid or mock, reports clear error or sandbox status.
    """
    clean_acct = creds.ad_account_id.strip().replace("act_", "")
    formatted_acct = f"act_{clean_acct}"
    token = creds.access_token.strip()

    RUNTIME_META_CONFIG["access_token"] = token
    RUNTIME_META_CONFIG["ad_account_id"] = clean_acct
    RUNTIME_META_CONFIG["page_id"] = (creds.page_id or "").strip()
    RUNTIME_META_CONFIG["pixel_id"] = (creds.pixel_id or "").strip()

    # If mock token is given, acknowledge sandbox mode
    if "mock" in token.lower() or len(token) < 20:
        launcher.dry_run = True
        return {
            "verified": False,
            "mode": "SANDBOX_DRY_RUN",
            "message": "Saved sandbox test credentials. All launches will simulate real Meta Graph API calls without spending money."
        }

    # Live Handshake with Meta Graph API v21.0
    url = f"https://graph.facebook.com/v21.0/{formatted_acct}"
    params = {
        "fields": "name,account_status,currency,amount_spent,business_name",
        "access_token": token,
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params=params)
            data = resp.json()
            if resp.status_code == 200 and "id" in data:
                launcher.dry_run = False
                return {
                    "verified": True,
                    "mode": "LIVE_CONNECTED",
                    "account_details": {
                        "id": data.get("id"),
                        "name": data.get("name", "Verified Meta Ad Account"),
                        "currency": data.get("currency", "USD"),
                        "account_status": data.get("account_status"),
                        "business_name": data.get("business_name", "N/A"),
                    },
                    "message": f"Successfully connected to Meta Ad Account: {data.get('name')} ({data.get('id')})"
                }
            else:
                err_msg = data.get("error", {}).get("message", "Meta API rejected access token or Ad Account ID.")
                launcher.dry_run = True
                return {
                    "verified": False,
                    "mode": "AUTH_FAILED",
                    "error": err_msg,
                    "raw_meta_response": data,
                }
    except Exception as exc:
        launcher.dry_run = True
        return {
            "verified": False,
            "mode": "NETWORK_ERROR",
            "error": str(exc),
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
    
    is_live = not launcher.dry_run and bool(RUNTIME_META_CONFIG["access_token"])
    return {
        "status": "DISPATCHED_LIVE" if is_live else "STAGED_SANDBOX",
        "mode": "LIVE_CONNECTED" if is_live else "SANDBOX_SIMULATION",
        "ad_account_id": RUNTIME_META_CONFIG.get("ad_account_id") or "act_sandbox_soe",
        "bundle": bundle,
        "message": (
            f"Campaign successfully created in Meta Ads Manager ({RUNTIME_META_CONFIG.get('ad_account_id')}) in PAUSED review state."
            if is_live else
            "Real Meta Graph API v21.0 payload constructed and validated. Running in Sandbox Simulation mode (no real ad spend occurred)."
        )
    }

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
