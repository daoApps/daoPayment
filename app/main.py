from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.wallets import router as wallets_router
from app.api.policies import router as policies_router
from app.api.audit import router as audit_router
from app.api.payments import router as payments_router

app = FastAPI()

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有源（在生产环境中应进行适当限制）
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(wallets_router, prefix="/api")
app.include_router(policies_router, prefix="/api")
app.include_router(audit_router, prefix="/api")
app.include_router(payments_router, prefix="/api/payments")

@app.get("/health")
def health_check():
    return {"status": "ok"}
