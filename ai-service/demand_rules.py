# Phase 2: Core Domain Logic - Demand Rules

# Base rate table per skill category (in INR)
BASE_RATES = {
    "electrician": 400.0,
    "plumber": 350.0,
    "domestic_helper": 200.0,
    "caregiver": 500.0,
    "driver": 300.0,
    "carpenter": 450.0,
}

def get_base_rate(skill_category: str) -> float:
    """Returns the base rate for a given skill category."""
    # Default to 300 if skill is not explicitly listed
    return BASE_RATES.get(skill_category.lower(), 300.0)

def get_day_of_week_multiplier(day_of_week: int) -> float:
    """
    Returns a multiplier based on the day of the week.
    day_of_week: 0 = Monday, ..., 6 = Sunday (matching Python's datetime.weekday())
    """
    # Weekend surge pricing (Saturday and Sunday)
    if day_of_week in [5, 6]:
        return 1.25  # 25% surge on weekends
    
    # Mid-week lull (e.g., Tuesday, Wednesday)
    if day_of_week in [1, 2]:
        return 0.95  # 5% discount

    # Standard rate for other days
    return 1.0

def calculate_demand_multiplier(skill_category: str, day_of_week: int) -> float:
    """
    Phase 2: Currently only uses the day_of_week multiplier.
    Phase 3 will add seasonal and real-time demand heuristics.
    """
    return get_day_of_week_multiplier(day_of_week)

def calculate_suggested_price(skill_category: str, day_of_week: int) -> float:
    """
    Calculates the final suggested price based on base rate and multipliers.
    """
    base = get_base_rate(skill_category)
    multiplier = calculate_demand_multiplier(skill_category, day_of_week)
    return round(base * multiplier, 2)
