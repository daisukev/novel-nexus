from pydantic import BaseModel


class Genre(BaseModel):
    id: int
    name: str


class GenreListOut(BaseModel):
    genres: list[Genre]
