from uuid import UUID
from pydantic import BaseModel, EmailStr, Field

class UserAuth(BaseModel):
  email: EmailStr = Field(..., description="E-mail do usuario")
  username: str = Field(
    ..., 
    min_length=5,
    max_length=50,
    description="Username"
  )
  password: str = Field(
    ...,
    min_length=5,
    max_length=20,
    description="Senha do usuario"
  )

class Userdetail(BaseModel):
  user_id: UUID
  username: str
  email: str
  