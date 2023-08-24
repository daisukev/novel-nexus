from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from models.chapters import ChapterOut, ChapterIn, ChapterListOut
from queries.chapters import ChapterQueries
from psycopg.errors import ForeignKeyViolation
from authenticator import authenticator

router = APIRouter()


def get_current_account_data():
    return authenticator.get_current_account_data()


@router.get("/api/chapters/{chapter_id}", response_model=Optional[ChapterOut])
def get_chapter(
    chapter_id: int,
    queries: ChapterQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
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
def delete_chapter(
    chapter_id: int,
    queries: ChapterQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    chapter = queries.get_chapter(chapter_id)
    if chapter is None:
        raise HTTPException(
            status_code=404,
            detail="No chapter found with id {}".format(chapter_id),
        )
    if chapter["author_id"] != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to delete this chapter.",
        )
    queries.delete_chapter(chapter_id)
    return True


@router.get("/api/chapters", response_model=ChapterListOut)
def get_chapters(
    queries: ChapterQueries = Depends(),
):
    return {"chapters": queries.get_published_chapters()}


@router.post("/api/chapters", response_model=ChapterOut)
def create_chapter(
    book_id: int,
    chapter: ChapterIn,
    queries: ChapterQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    book = queries.get_book(book_id)
    if book is None:
        raise HTTPException(
            status_code=404,
            detail="No book found with id {}".format(book_id),
        )
    if book["author_id"] != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to create a chapter for this book.",
        )
    try:
        return queries.create_chapter(chapter)
    except ForeignKeyViolation:
        raise HTTPException(
            status_code=400,
            detail=(
                "Failed to create chapter due"
                "to foreign key violation with book"
            ),
        )
