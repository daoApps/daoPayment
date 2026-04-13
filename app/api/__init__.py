from fastapi import APIRouter
from .wallets import router as wallets_router
from .policies import router as policies_router

router = APIRouter()
router.include_router(wallets_router)
router.include_router(policies_router)
