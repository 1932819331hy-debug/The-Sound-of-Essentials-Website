import pytest
from soe_mcls.creative_forge import CreativeForge

def test_generate_ad_package_enforces_canon():
    forge = CreativeForge()
    package = forge.build_ad_variant(
        archetype_id="ARC-01",
        delta="SCREEN_VS_SENSORY",
        campaign="THE_ENEMY",
        language="en",
        buyer_track="D2C"
    )
    assert package["archetype_id"] == "ARC-01"
    assert "soelearn.com/listen" in package["destination_url"]
    assert "utm_campaign=the_enemy" in package["destination_url"]
    assert "utm_content=ARC-01" in package["destination_url"]
    assert len(package["primary_text"].split("\n\n")) == 3  # 3-Layer Rule paragraphs
    assert "warm" in package["visual_prompt"].lower() or "tactile" in package["visual_prompt"].lower()

def test_multilingual_generation():
    forge = CreativeForge()
    pkg_es = forge.build_ad_variant("ARC-02", "ALGORITHM_VS_HANDCRAFTED", "VICTORY_GARDEN", language="es")
    pkg_fr = forge.build_ad_variant("ARC-02", "ALGORITHM_VS_HANDCRAFTED", "VICTORY_GARDEN", language="fr")
    assert "Escucha" in pkg_es["headline"] or "Gratis" in pkg_es["headline"]
    assert "Écoutez" in pkg_fr["headline"] or "Gratuit" in pkg_fr["headline"]
