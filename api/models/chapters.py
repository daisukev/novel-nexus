from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class ChapterOrderUpdate(BaseModel):
    id: int
    chapter_order: int


class ChapterOrderUpdateList(BaseModel):
    chapters: List[ChapterOrderUpdate]


class ChapterIn(BaseModel):
    chapter_order: Optional[int]
    title: str
    content: Optional[str]


class ChapterOut(BaseModel):
    id: int
    book_id: int
    chapter_order: int
    title: str
    content: str
    views: int
    is_published: Optional[bool]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class AllChaptersOut(BaseModel):
    id: int
    book_id: int
    chapter_order: int
    title: str
    views: int
    is_published: Optional[bool]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class PublishedChaptersOut(BaseModel):
    id: int
    book_id: int
    chapter_order: int
    title: str
    views: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class ChapterListOut(BaseModel):
    chapters: List[ChapterOut]


class ChapterUpdate(BaseModel):
    chapter_order: Optional[int]
    title: Optional[str]
    content: Optional[str]
    is_published: Optional[bool]
