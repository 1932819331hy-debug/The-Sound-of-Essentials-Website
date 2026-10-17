from typing import List, Dict, Any

class RhythmGuardianOptimizer:
    """
    MCLS Pillar 5: 2026 Battle-Tested Dual-Horizon Guardrails:
    - Protects Top-of-Funnel Value Gate (Engine A) from premature kills due to Meta 7-day attribution blindness.
    - Demands strict short-term ROAS for Direct-to-Print Showcase (Engine B).
    """

    def __init__(
        self,
        max_lead_cpa_dollars: float = 2.50,
        min_ctr_percent: float = 0.80,
        min_spend_for_decision_dollars: float = 10.0,
        scale_step_ratio: float = 1.20,
    ):
        self.max_lead_cpa = max_lead_cpa_dollars
        self.min_ctr = min_ctr_percent
        self.min_spend = min_spend_for_decision_dollars
        self.scale_step = scale_step_ratio

    def evaluate_ads(self, ad_metrics: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        decisions: Dict[str, Dict[str, Any]] = {}

        for row in ad_metrics:
            ad_id = row["ad_id"]
            engine_type = row.get("engine_type", "ENGINE_A_VALUE_GATE")
            spend = float(row.get("spend", 0.0))
            leads = int(row.get("leads", 0))
            purchases = int(row.get("purchases", 0))
            ctr = float(row.get("ctr", 0.0))
            current_budget = int(row.get("current_budget_cents", 3000))

            if spend < self.min_spend:
                decisions[ad_id] = {
                    "action": "HOLD",
                    "reason": f"Spend (${spend:.2f}) below learning threshold (${self.min_spend:.2f}).",
                }
                continue

            # Engine A: Top-of-Funnel Value Gate (/listen Free Album)
            if engine_type == "ENGINE_A_VALUE_GATE":
                lead_cpa = (spend / leads) if leads > 0 else 999.0
                if leads == 0 and spend >= (self.min_spend * 1.5):
                    decisions[ad_id] = {
                        "action": "PAUSE",
                        "reason": f"Engine A Stop-Loss: Spend=${spend:.2f} with 0 leads (CTR={ctr:.2f}%).",
                    }
                elif lead_cpa > self.max_lead_cpa and ctr < self.min_ctr:
                    decisions[ad_id] = {
                        "action": "PAUSE",
                        "reason": f"Engine A Fatigue: Lead CPA=${lead_cpa:.2f} (target <= ${self.max_lead_cpa:.2f}), CTR={ctr:.2f}%.",
                    }
                elif leads >= 5 and lead_cpa <= self.max_lead_cpa:
                    new_budget = int(round(current_budget * self.scale_step))
                    decisions[ad_id] = {
                        "action": "SCALE_BUDGET",
                        "new_budget_cents": new_budget,
                        "reason": f"Engine A Winner: Lead CPA=${lead_cpa:.2f} <= ${self.max_lead_cpa:.2f}. Scaling +20%.",
                    }
                else:
                    decisions[ad_id] = {
                        "action": "HOLD",
                        "reason": f"Engine A Active within healthy bounds (CPA=${lead_cpa:.2f}). Preserving 90-day gestation window.",
                    }

            # Engine B: Direct-to-Print Tactile Showcase (/shop)
            else:
                purchase_cpa = (spend / purchases) if purchases > 0 else 999.0
                if purchases == 0 and spend >= 35.0: # Spent book cost with no sale
                    decisions[ad_id] = {
                        "action": "PAUSE",
                        "reason": f"Engine B Stop-Loss: Spent ${spend:.2f} with 0 sales.",
                    }
                elif purchases >= 2 and purchase_cpa <= 25.0:
                    new_budget = int(round(current_budget * self.scale_step))
                    decisions[ad_id] = {
                        "action": "SCALE_BUDGET",
                        "new_budget_cents": new_budget,
                        "reason": f"Engine B Winner: Purchase CPA=${purchase_cpa:.2f}. Scaling +20%.",
                    }
                else:
                    decisions[ad_id] = {
                        "action": "HOLD",
                        "reason": f"Engine B Learning/Testing.",
                    }

        return decisions
