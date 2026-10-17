from typing import List, Dict, Any
from soe_mcls.config import settings
from soe_mcls.creative_forge import CreativeForge

class MetaCampaignLauncher:
    """MCLS Pillar 3: One-Click Meta Marketing API v21.0 Tandem Campaign Dispatcher."""

    def __init__(self, dry_run: bool = True):
        self.dry_run = dry_run
        self.forge = CreativeForge()

    def build_targeting_spec(self, buyer_track: str, language: str) -> Dict[str, Any]:
        locales_map = {"en": [6, 24], "es": [23], "fr": [9]}
        if buyer_track == "D2C":
            return {
                "geo_locations": {"countries": ["US", "CA"]},
                "age_min": 24,
                "age_max": 48,
                "locales": locales_map.get(language, [6]),
                "targeting_automation": {"advantage_audience": 1},
            }
        else:
            return {
                "geo_locations": {"countries": ["US"]},
                "age_min": 28,
                "age_max": 65,
                "targeting_automation": {"advantage_audience": 1},
            }

    def prepare_full_campaign_launch(
        self,
        campaign_key: str,
        delta_key: str,
        daily_budget_cents: int,
        buyer_track: str = "D2C",
        language: str = "en",
        archetype_ids: List[str] = None,
        engine_type: str = "ENGINE_A_VALUE_GATE", # ENGINE_A_VALUE_GATE, ENGINE_B_DIRECT_OFFER, ENGINE_C_RETARGETING
    ) -> Dict[str, Any]:
        archetype_ids = archetype_ids or ["ARC-01", "ARC-02", "ARC-03"]

        campaign_spec = {
            "name": f"SOE | {campaign_key} | {delta_key} | {engine_type} | {language.upper()}",
            "objective": "OUTCOME_SALES",
            "status": "ACTIVE",
            "special_ad_categories": [],
            "daily_budget": daily_budget_cents,
            "bid_strategy": "LOWEST_COST_WITHOUT_CAP",
        }

        adset_spec = {
            "name": f"ADSET | {delta_key} | {engine_type} ({language.upper()})",
            "optimization_goal": "OFFSITE_CONVERSIONS",
            "billing_event": "IMPRESSIONS",
            "promoted_object": {
                "pixel_id": settings.META_PIXEL_ID,
                "custom_event_type": "PURCHASE" if engine_type == "ENGINE_B_DIRECT_OFFER" else "LEAD",
            },
            "targeting": self.build_targeting_spec(buyer_track, language),
            "status": "ACTIVE",
        }

        ad_specs = []
        for idx, arc_id in enumerate(archetype_ids, start=1):
            creative = self.forge.build_ad_variant(
                archetype_id=arc_id,
                delta=delta_key,
                campaign=campaign_key,
                language=language,
                buyer_track=buyer_track,
                audio_track_number=idx,
            )
            # If Engine B, direct to shop checkout
            if engine_type == "ENGINE_B_DIRECT_OFFER":
                creative["destination_url"] = f"{settings.BASE_DOMAIN}/shop/rhythm-quest-bundle?utm_source=meta&utm_medium=paid_social&utm_campaign={campaign_key.lower()}&utm_content={arc_id}"
                creative["call_to_action_type"] = "SHOP_NOW"

            ad_specs.append({
                "name": f"AD | {arc_id} | {delta_key} | {engine_type} | Track-{idx}",
                "status": "ACTIVE",
                "creative": {
                    "object_story_spec": {
                        "page_id": settings.META_PAGE_ID,
                        "link_data": {
                            "message": creative["primary_text"],
                            "link": creative["destination_url"],
                            "name": creative["headline"],
                            "call_to_action": {
                                "type": creative["call_to_action_type"],
                                "value": {"link": creative["destination_url"]},
                            },
                        },
                    }
                },
                "forge_metadata": creative,
            })

        return {
            "ad_account_id": settings.META_AD_ACCOUNT_ID,
            "campaign_spec": campaign_spec,
            "adset_spec": adset_spec,
            "ad_specs": ad_specs,
        }
