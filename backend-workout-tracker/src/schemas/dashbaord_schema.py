from pydantic import BaseModel


class DashboardData(BaseModel):
    data: str
