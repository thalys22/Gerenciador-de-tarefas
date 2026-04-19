import bcrypt
from cryptography.utils import deprecated
from typing import Union, Any
from datetime import datetime, timedelta
from jose import jwt
from core.config import settings


# Criptografia da senha
def get_password(password: str) -> str:
  password = password.encode('utf-8')
  salt = bcrypt.gensalt()
  hashed_password = bcrypt.hashpw(password, salt)
  return hashed_password.decode('utf-8')

# Descriptografia da senha
def verify_password(password: str, hashed_password) -> bool:
  password = password.encode('utf-8')
  hashed_password = hashed_password.encode('utf-8')

  return bcrypt.checkpw(password, hashed_password)

def create_access_token(subject: Union[str, any], expires_delta: int = None) -> str:
  if expires_delta is not None:
    expires_delta = datetime.utcnow() + expires_delta
  else:
    expires_delta = datetime.utcnow() + timedelta(
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

def create_refresh_token(subject: Union[str, any], expires_delta: int = None) -> str:
  if expires_delta is not None:
    expires_delta = datetime.utcnow() + expires_delta
  else:
    expires_delta = datetime.utcnow() + timedelta(
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