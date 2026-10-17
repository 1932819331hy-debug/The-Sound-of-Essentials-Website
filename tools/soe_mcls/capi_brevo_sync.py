import hashlib
import re
import time
from typing import Optional, Dict, Any
import httpx
from soe_mcls.config import settings
from soe_mcls.canon import BREVO_CAMPAIGN_MAP

class TelemetrySyncEngine:
    """MCLS Pillar 4: Server-Side Meta CAPI + Brevo 18-Campaign Router + First-Touch Ledger."""

    @staticmethod
    def _sha256_norm(value: str) -> str:
        cleaned = value.strip().lower()
        return hashlib.sha256(cleaned.encode("utf-8")).hexdigest()

    def build_meta_capi_payload(
        self,
        event_name: str,
        email: str,
        event_id: str,
        source_url: str,
        value_cents: int = 0,
        phone: Optional[str] = None,
        client_ip: Optional[str] = None,
        user_agent: Optional[str] = None,
        fbc: Optional[str] = None,
        fbp: Optional[str] = None,
    ) -> Dict[str, Any]:
        user_data: Dict[str, Any] = {
            "em": [self._sha256_norm(email)],
        }
        if phone:
            digits = re.sub(r"\D", "", phone)
            user_data["ph"] = [self._sha256_norm(digits)]
        if client_ip:
            user_data["client_ip_address"] = client_ip
        if user_agent:
            user_data["client_user_agent"] = user_agent
        if fbc:
            user_data["fbc"] = fbc
        if fbp:
            user_data["fbp"] = fbp

        event_payload: Dict[str, Any] = {
            "event_name": event_name,
            "event_time": int(time.time()),
            "event_id": event_id,
            "event_source_url": source_url,
            "action_source": "website",
            "user_data": user_data,
        }
        if value_cents > 0:
            event_payload["custom_data"] = {
                "currency": "USD",
                "value": round(value_cents / 100.0, 2),
            }

        return {"data": [event_payload]}

    async def dispatch_capi_event(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        url = f"https://graph.facebook.com/{settings.META_API_VERSION}/{settings.META_PIXEL_ID}/events"
        params = {"access_token": settings.META_ACCESS_TOKEN}
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, params=params, json=payload)
            return resp.json()

    def build_brevo_contact_payload(
        self,
        email: str,
        first_name: str,
        buyer_track: str,
        delta: str,
        purchased_skus: list[str],
        child_age_bracket: Optional[str] = None,
        phone: Optional[str] = None,
        first_touch_ad_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        delta_key = delta.lower()
        if buyer_track == "D2C":
            list_id = BREVO_CAMPAIGN_MAP["D2C"].get(delta_key, 101)
        else:
            list_id = BREVO_CAMPAIGN_MAP["B2B"]["b2b_sequence_1"]

        attributes: Dict[str, Any] = {
            "FIRSTNAME": first_name,
            "BUYER_TRACK": buyer_track,
            "CULTURAL_DELTA": delta_key,
            "PURCHASED_SKUS": ",".join(purchased_skus),
        }
        if child_age_bracket:
            attributes["CHILD_AGE_BRACKET"] = child_age_bracket
        if phone:
            attributes["SMS"] = phone
        if first_touch_ad_id:
            attributes["FIRST_TOUCH_AD_ID"] = first_touch_ad_id
            attributes["FIRST_TOUCH_TIMESTAMP"] = int(time.time())

        return {
            "email": email.strip().lower(),
            "attributes": attributes,
            "listIds": [list_id],
            "updateEnabled": True,
        }
