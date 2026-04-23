import bcrypt
from typing import Union, Any
from datetime import datetime, timedelta, timezone
from jose import jwt
from core.config import settings


# Criptografia da senha
def get_password(password: str) -> str:
  hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
  return hashed_password.decode('utf-8')

# Descriptografia da senha
def verify_password(password: str, hashed_password: str) -> bool:
  return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(subject: Union[str, Any], expires_delta: Union[int, timedelta] = None) -> str:
  if expires_delta is not None:
    if isinstance(expires_delta, int):
      expires_delta = datetime.now(timezone.utc) + timedelta(minutes=expires_delta)
    else:
      expires_delta = datetime.now(timezone.utc) + expires_delta
  else:
    expires_delta = datetime.now(timezone.utc) + timedelta(
      minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
  
  info_jwt = {
    "exp": expires_delta,
    "sub": str(subject)
  }

  jwt_encoded = jwt.encode(
    info_jwt,
    settings.JWT_SECRET_KEY,
    settings.ALGORITHM

  )

  return jwt_encoded

def create_refresh_token(subject: Union[str, Any], expires_delta: Union[int, timedelta] = None) -> str:
  if expires_delta is not None:
    if isinstance(expires_delta, int):
      expires_delta = datetime.now(timezone.utc) + timedelta(minutes=expires_delta)
    else:
      expires_delta = datetime.now(timezone.utc) + expires_delta
  else:
    expires_delta = datetime.now(timezone.utc) + timedelta(
      minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES
    )
  
  info_jwt = {
    "exp": expires_delta,
    "sub": str(subject)
  }

  jwt_encoded = jwt.encode(
    info_jwt,
    settings.JWT_REFRESH_SECRET_KEY,
    settings.ALGORITHM

  )

  return jwt_encoded