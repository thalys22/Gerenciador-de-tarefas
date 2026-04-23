# pip install python-decouple

from typing import List
from decouple import config
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    API_V1_STR: str = '/api/v1'
    JWT_SECRET_KEY: str = config('JWT_SECRET_KEY', cast=str)
    JWT_REFRESH_SECRET_KEY: str = config('JWT_REFRESH_SECRET_KEY', cast=str)
    ALGORITHM: str ='HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 dias
    BACKEND_CORS_ORIGINS: List[str] = [
      'http://localhost:3000',
      'http://127.0.0.1:5500',
      'http://localhost:5500'
    ]
    PROJECT_NAME: str = "TODOFast"
    
    # Database
    MONGO_CONNECTION_STRING: str = config("MONGO_CONNECTION_STRING", cast=str)
    
    model_config = SettingsConfigDict(case_sensitive=True)
        
settings = Settings()