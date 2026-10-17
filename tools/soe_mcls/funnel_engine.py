import uuid
from typing import Dict, Any
import stripe
from soe_mcls.config import settings
from soe_mcls.canon import PRODUCT_LADDER

stripe.api_key = settings.STRIPE_SECRET_KEY

class FunnelCheckoutService:
    """MCLS Pillar 2: Direct Web Micro-Funnel & Stripe Card Vaulting."""

    def __init__(self, mock_mode: bool = False):
        self.mock_mode = mock_mode

    def create_vaulted_checkout_intent(
        self,
        email: str,
        sku_key: str,
        delta: str,
        campaign: str = "the_enemy",
        first_touch_ad_id: str = None,
    ) -> Dict[str, Any]:
        if sku_key not in PRODUCT_LADDER:
            raise ValueError(f"Invalid SKU key: {sku_key}")

        product = PRODUCT_LADDER[sku_key]
        metadata = {
            "sku": product["sku"],
            "sku_key": sku_key,
            "cultural_delta": delta,
            "campaign": campaign,
            "event_id": f"evt_{uuid.uuid4().hex[:12]}",
        }
        if first_touch_ad_id:
            metadata["first_touch_ad_id"] = first_touch_ad_id

        intent_params: Dict[str, Any] = {
            "amount": product["price_cents"],
            "currency": "usd",
            "receipt_email": email,
            "metadata": metadata,
        }
        if product["vaults_card"]:
            intent_params["setup_future_usage"] = "off_session"

        if self.mock_mode:
            return {
                "id": f"pi_mock_{uuid.uuid4().hex[:8]}",
                "client_secret": "pi_mock_secret_123",
                **intent_params,
            }

        customer = stripe.Customer.create(email=email, metadata={"cultural_delta": delta})
        intent_params["customer"] = customer.id
        intent = stripe.PaymentIntent.create(**intent_params)
        return dict(intent)

    def charge_vaulted_upsell(
        self,
        customer_id: str,
        payment_method_id: str,
        sku_key: str,
    ) -> Dict[str, Any]:
        if sku_key not in PRODUCT_LADDER:
            raise ValueError(f"Invalid SKU key: {sku_key}")

        product = PRODUCT_LADDER[sku_key]
        charge_params: Dict[str, Any] = {
            "amount": product["price_cents"],
            "currency": "usd",
            "customer": customer_id,
            "payment_method": payment_method_id,
            "off_session": True,
            "confirm": True,
            "metadata": {
                "sku": product["sku"],
                "upsell_one_click": "true",
            },
        }

        if self.mock_mode:
            return {"id": f"pi_upsell_{uuid.uuid4().hex[:8]}", "status": "succeeded", **charge_params}

        intent = stripe.PaymentIntent.create(**charge_params)
        return dict(intent)
