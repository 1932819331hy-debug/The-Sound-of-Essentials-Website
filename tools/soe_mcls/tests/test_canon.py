import pytest
from soe_mcls.canon import (
    PRODUCT_LADDER,
    CULTURAL_DELTAS,
    PRODUCTION_CAMPAIGNS,
    validate_three_layer_ad,
)

def test_product_ladder_pricing_and_skus():
    assert PRODUCT_LADDER["FREE_ALBUM"]["price_cents"] == 0
    assert PRODUCT_LADDER["STARTER_PACK"]["price_cents"] == 700
    assert PRODUCT_LADDER["STARTER_PACK"]["vaults_card"] is True
    assert PRODUCT_LADDER["EBOOK_TRIPWIRE"]["price_cents"] == 1900
    assert PRODUCT_LADDER["WORKBOOK_DIGITAL"]["price_cents"] == 2100
    assert PRODUCT_LADDER["WORKBOOK_PRINT"]["price_cents"] == 3500
    assert PRODUCT_LADDER["DICTIONARY_DIGITAL"]["price_cents"] == 5500
    assert PRODUCT_LADDER["DICTIONARY_PRINT"]["price_cents"] == 7900
    assert PRODUCT_LADDER["FULL_BUNDLE"]["price_cents"] == 8900
    assert PRODUCT_LADDER["RHYTHM_PASS"]["price_cents"] == 1499
    assert PRODUCT_LADDER["RHYTHM_PASS"]["is_continuity"] is True

def test_cultural_deltas_and_campaigns_count():
    assert len(CULTURAL_DELTAS) == 5
    assert len(PRODUCTION_CAMPAIGNS) == 6

def test_three_layer_ad_validation():
    valid_ad = {
        "layer_1_ache": "Tired of watching algorithms hijack your toddler's nervous system?",
        "layer_2_solution": "Replace screen zombie time with 19 handcrafted songs and 400 tactile activities.",
        "layer_3_invitation": "Stream the 19-track Rhythm Quest album free today at soelearn.com/listen."
    }
    assert validate_three_layer_ad(valid_ad) is True

    invalid_ad = {"layer_1_ache": "Buy now", "layer_2_solution": "", "layer_3_invitation": "Click"}
    with pytest.raises(ValueError, match="violates the SOE 3-Layer Rule"):
        validate_three_layer_ad(invalid_ad)
