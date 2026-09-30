from pydantic import BaseModel

# Skeleton file for Pydantic models (Phase 3)

class DemandForecastRequest(BaseModel):
    zone_id: str
    skill_category: str
