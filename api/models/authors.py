from datetime import datetime
from pydantic import BaseModel, SecretStr, HttpUrl
from typing import Optional, Union
from jwtdown_fastapi.authentication import Token


class AuthorIn(BaseModel):
    username: str
    password: str


class AuthorUpdate(BaseModel):
    username: Optional[str]
    password: Optional[SecretStr]
    biography: Optional[str]
    avatar: Optional[Union[HttpUrl, None]]
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]


class AuthorPasswordOut(BaseModel):
    id: Optional[int]
    username: Optional[str]
    password: Optional[str]
    biography: Optional[str]
    avatar: Optional[Union[HttpUrl, None]]
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    # created_at: Optional[datetime]


class AuthorOut(BaseModel):
    id: int
    first_name: Optional[str]
    last_name: Optional[str]
    biography: Optional[str]
    avatar: Optional[HttpUrl]
    created_at: Optional[datetime]
    username: Optional[str]


class AuthorListOut(BaseModel):
    authors: list[AuthorOut]


class HttpError(BaseModel):
    detail: str


class AccountToken(Token):
    account: AuthorOut


class AccountForm(BaseModel):
    username: str
    password: str
