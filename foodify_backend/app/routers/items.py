from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.schemas import TokenData
from app.db import get_db, crud


router = APIRouter(prefix="/items", tags=["items"])

@router.get("/")
def read_items(current: TokenData = Depends(get_current_user)):
    # usa current.tenant_id per filtrare nel DB
    return {"msg": f"items for tenant {current.tenant_id}"}
