from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from models.chapters import (
    ChapterOut,
    ChapterIn,
    ChapterListOut
)
from queries.chapters import ChapterQueries
from psycopg.errors import ForeignKeyViolation

router = APIRouter()


@router.get("/api/chapters/{chapter_id}", response_model=Optional[ChapterOut])
def get_chapter(
    chapter_id: int,
    queries: ChapterQueries = Depends(),
):
    record = queries.get_chapter(chapter_id)
    if record is None:
        raise HTTPException(
            status_code=404,
            detail="No chapter found with id {}".format(chapter_id),
        )
    else:
        return record


@router.delete("/api/chapters/{chapter_id}", response_model=bool)
def delete_chapter(chapter_id: int, queries: ChapterQueries = Depends()):
    queries.delete_chapter(chapter_id)
    return True


@router.get("/api/chapters", response_model=ChapterListOut)
def get_chapters(queries: ChapterQueries = Depends()):
    return {"chapters": queries.get_chapters()}


@router.post("/api/chapters", response_model=ChapterOut)
def create_chapter(
    chapter: ChapterIn,
    queries: ChapterQueries = Depends(),
):
    try:
        return queries.create_chapter(chapter)
    except ForeignKeyViolation:
        raise HTTPException(
            status_code=400,
            detail=("Failed to create chapter due"
                    "to foreign key violation with book")
        )
