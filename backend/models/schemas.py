from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TableBase(BaseModel):
    number: str
    capacity: int
    status: str

class TableCreate(TableBase):
    pass

class TableUpdate(BaseModel):
    status: str
    occupied_since: Optional[datetime] = None

class TableResponse(TableBase):
    id: int
    occupied_since: Optional[datetime]
    updated_at: datetime

    class Config:
        from_attributes = True

class QueueEntryBase(BaseModel):
    name: str
    party_size: int
    phone: Optional[str] = None

class QueueEntryCreate(QueueEntryBase):
    pass

class QueueEntryResponse(QueueEntryBase):
    id: int
    position: int
    estimated_wait_time: int
    joined_at: datetime
    notified: int

    class Config:
        from_attributes = True
