from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class ReadHistory(BaseModel):
    author_id: int
    chapter_id: int
    book_id: int
    read_at: Optional[datetime]


class ReadHistoryList(BaseModel):
    read_history: List[ReadHistory]


class AuthorReadHistory(BaseModel):
    book_title: str
    book_cover: Optional[str]
    chapter_title: str
    chapter_id: int
    book_id: int
    read_at: datetime


class ReadHistoryResponse(BaseModel):
    read_history: List[AuthorReadHistory]


class BookViewCount(BaseModel):
    views: int
