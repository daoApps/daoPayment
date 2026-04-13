from fastapi import APIRouter

router = APIRouter(prefix="/policies", tags=["policies"])

@router.get("")
@router.get("/")
async def get_policies():
    return []

@router.post("")
@router.post("/")
async def create_policy():
    return {}
