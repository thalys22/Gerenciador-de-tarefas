from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from services.user_service import UserService
from core.security import create_access_token, create_refresh_token
from schemas.auth_schema import TokenSchema
from schemas.user_schema import Userdetail
from models.user_model import User
from api.depedencies.user_deps import get_current_user

auth_router = APIRouter()

@auth_router.post(
  '/login', summary="Cria access token e Refresh Token",
  response_model=TokenSchema
)

async def login(data: OAuth2PasswordRequestForm = Depends()) -> Any:
  usuario = await UserService.authenticate(
    email = data.username,
    password = data.password
  )

  if not usuario:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail='E-mail ou senha estão incorretos'
    )
  
  return {
    "access_token": create_access_token(usuario.user_id),
    "refresh_token": create_refresh_token(usuario.user_id)
  }

@auth_router.get('/test-token', summary='testando o token', response_model=Userdetail)
async def test_token(user: User = Depends(get_current_user)):
  return user