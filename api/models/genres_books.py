from pydantic import BaseModel


class GenreBook(BaseModel):
    genre_id: int
    book_id: int


class GenreBookIn(BaseModel):
    genre_id: int
