from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class ChapterIn(BaseModel):
    book_id: int
    chapter_order: int
    title: str
    content: str


class ChapterOut(BaseModel):
    id: int
    book_id: int
    chapter_order: int
    title: str
    content: str
    views: int
    is_published: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class ChapterListOut(BaseModel):
    chapters: List[ChapterOut]
