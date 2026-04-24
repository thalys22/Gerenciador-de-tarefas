# pip install beanie
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from fastapi import FastAPI
from core.config import settings
from beanie import init_beanie
from models.user_model import User
from api.api_v1.router import router
from models.task_model import Task
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
  CORSMiddleware,
  allow_origins=settings.BACKEND_CORS_ORIGINS,
  allow_credentials=True,
  allow_methods=['*'],
  allow_headers=['*']
)

@app.on_event("startup")
async def app_init():
    client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING)
    # Monkeypatch for Beanie 2.1.0 compatibility with newer Motor versions
    try:
        client.append_metadata = lambda x: None
    except Exception:
        object.__setattr__(client, "append_metadata", lambda x: None)
        
    await init_beanie(
        database=client.get_default_database(),
        document_models=[
            User,
            Task
        ]
    )

app.include_router(
  router,
  prefix=settings.API_V1_STR
)

