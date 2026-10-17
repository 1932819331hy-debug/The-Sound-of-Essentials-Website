from typing import Dict, Any
from soe_mcls.canon import CULTURAL_DELTAS, PRODUCTION_CAMPAIGNS, validate_three_layer_ad
from soe_mcls.config import settings

MULTILINGUAL_TEMPLATES = {
    "en": {
        "SCREEN_VS_SENSORY": {
            "layer_1_ache": "You can see it in their eyes after twenty minutes of algorithmic cartoons—that glazed, overstimulated restlessness that steals the peace right out of your living room.",
            "layer_2_solution": "Built with a father's heart and a mother's love, The Sound of Essentials replaces screen rot with 19 handcrafted songs, 4,232 illustrated words, and 400 tactile daily quests for ages 2–7.",
            "layer_3_invitation": "Press play on a calmer home tonight. Unlock all 19 tracks of the Rhythm Quest album 100% free—no app downloads, no algorithms.",
            "headline": "Stream the Free 19-Track Rhythm Quest Album",
        },
        "ALGORITHM_VS_HANDCRAFTED": {
            "layer_1_ache": "Silicon Valley engineered their apps to harvest your child's attention span before they even learn to tie their shoes.",
            "layer_2_solution": "Give them something real to hold, sing, and master: an 8-week musical quest packed with rhythm blocks, sensory movement, and timeless vocabulary.",
            "layer_3_invitation": "Start with the music. Claim the complete 19-song Rhythm Quest album free right now.",
            "headline": "Handcrafted Music for Ages 2–7 (Free Album)",
        }
    },
    "es": {
        "ALGORITHM_VS_HANDCRAFTED": {
            "layer_1_ache": "Los algoritmos fueron diseñados para capturar la atención de tu hijo antes de que aprenda a leer.",
            "layer_2_solution": "Creado con el corazón de un padre y el amor de una madre: 19 canciones artesanales, 4,232 palabras ilustradas y 400 actividades táctiles sin pantallas.",
            "layer_3_invitation": "Empieza hoy sin costo. Escucha el álbum completo de 19 canciones de Rhythm Quest totalmente gratis.",
            "headline": "Escucha el Álbum Gratis de 19 Canciones",
        }
    },
    "fr": {
        "ALGORITHM_VS_HANDCRAFTED": {
            "layer_1_ache": "Les algorithmes sont conçus pour capter l'attention de votre enfant avant même qu'il ne sache lire.",
            "layer_2_solution": "Créé avec le cœur d'un père et l'amour d'une mère : 19 chansons artisanales, 4 232 mots illustrés et 400 activités tactiles sans écran.",
            "layer_3_invitation": "Commencez gratuitement aujourd'hui. Écoutez l'album complet de 19 chansons Rhythm Quest sans aucun risque.",
            "headline": "Écoutez l'Album Gratuit de 19 Chansons",
        }
    }
}

class CreativeForge:
    """MCLS Pillar 1: Archetype & Asset Forge (3-Layer Copy + Visual/Video Specs)."""

    def build_ad_variant(
        self,
        archetype_id: str,
        delta: str,
        campaign: str,
        language: str = "en",
        buyer_track: str = "D2C",
        audio_track_number: int = 1,
    ) -> Dict[str, Any]:
        if delta not in CULTURAL_DELTAS:
            raise ValueError(f"Unknown Cultural Delta: {delta}")
        if campaign not in PRODUCTION_CAMPAIGNS:
            raise ValueError(f"Unknown Production Campaign: {campaign}")

        lang_dict = MULTILINGUAL_TEMPLATES.get(language, MULTILINGUAL_TEMPLATES["en"])
        copy_block = lang_dict.get(delta, MULTILINGUAL_TEMPLATES["en"]["SCREEN_VS_SENSORY"])

        validate_three_layer_ad(copy_block)

        primary_text = (
            f"{copy_block['layer_1_ache']}\n\n"
            f"{copy_block['layer_2_solution']}\n\n"
            f"{copy_block['layer_3_invitation']}"
        )

        campaign_slug = campaign.lower()
        delta_slug = delta.lower()
        destination_url = (
            f"{settings.BASE_DOMAIN}/listen"
            f"?utm_source=meta&utm_medium=paid_social"
            f"&utm_campaign={campaign_slug}"
            f"&utm_term={delta_slug}"
            f"&utm_content={archetype_id}_{language}"
        )

        visual_prompt = (
            f"Warm, grounded, tactile editorial photograph in golden morning light. "
            f"A parent and a 4-year-old child sitting on a woven rug exploring an open illustrated picture dictionary "
            f"and clapping to music. Screen-free sanctuary aesthetic, Kodak Portra 400 film grain, "
            f"theme: {CULTURAL_DELTAS[delta]}, campaign: {PRODUCTION_CAMPAIGNS[campaign]}."
        )

        return {
            "archetype_id": archetype_id,
            "delta": delta,
            "campaign": campaign,
            "language": language,
            "buyer_track": buyer_track,
            "primary_text": primary_text,
            "headline": copy_block["headline"],
            "layers": copy_block,
            "destination_url": destination_url,
            "visual_prompt": visual_prompt,
            "audio_track_number": audio_track_number,
            "call_to_action_type": "LISTEN_NOW" if buyer_track == "D2C" else "LEARN_MORE",
        }
