from fastapi import FastAPI
from demand_rules import calculate_suggested_price, get_base_rate, get_day_of_week_multiplier

app = FastAPI(title="GigGo AI Service", version="1.0.0")

@app.get("/ping")
def ping():
    return {"status": "ok", "message": "AI Service is running"}

@app.get("/test-demand")
def test_demand(skill: str = "electrician", day_of_week: int = 0):
    """
    Test endpoint for Phase 2 Demand Rules
    day_of_week: 0 (Monday) to 6 (Sunday)
    """
    base = get_base_rate(skill)
    multiplier = get_day_of_week_multiplier(day_of_week)
    final_price = calculate_suggested_price(skill, day_of_week)
    
    return {
        "skill": skill,
        "day_of_week": day_of_week,
        "base_rate": base,
        "multiplier": multiplier,
        "final_suggested_price": final_price
    }
