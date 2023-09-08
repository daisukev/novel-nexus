from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Optional, List

from models.authors import Message
from models.chapters import (
    AllChaptersOut,
    ChapterOrderUpdateList,
    ChapterOut,
    ChapterIn,
    ChapterListOut,
    ChapterUpdate,
    PublishedChaptersOut,
)

from queries.chapters import ChapterQueries
from authenticator import authenticator
from utils import get_book_author
from psycopg.errors import ForeignKeyViolation

router = APIRouter()


def get_current_account_data():
    return authenticator.get_current_account_data()


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
    book_id = chapter.dict().get("book_id")
    author_id = get_book_author(book_id)
    if author_id != account_data["id"]:
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
    chapters = queries.get_chapters()
    return {"chapters": chapters}


@router.post("/api/books/{book_id}/chapters", response_model=ChapterOut)
async def create_chapter(
    book_id: int,
    chapter: ChapterIn,
    queries: ChapterQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    book_author = get_book_author(book_id)

    if book_author != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to"
            " create a chapter for this book.",
        )
    try:
        return queries.create_chapter(chapter, book_id)
    except ForeignKeyViolation:
        raise HTTPException(
            status_code=400,
            detail=(
                "Failed to create chapter due"
                "to foreign key violation with book"
            ),
        )


@router.get(
    "/api/books/{book_id}/chapters",
    tags=["Chapters"],
    response_model=Dict[str, List[PublishedChaptersOut]],
)
def get_all_published_chapters_by_book_id(
    book_id: int,
    queries: ChapterQueries = Depends(),
):
    chapters = queries.get_all_published_chapters_by_book_id(book_id)
    return {"chapters": chapters}


# This is the protected endpoint for authors, which includes
# the unpublished chapters of the book.
@router.get(
    "/api/authors/books/{book_id}/chapters",
    tags=["Chapters"],
    response_model=dict[str, List[AllChaptersOut]],
)
def get_all_chapters_by_book_id(
    book_id: int,
    queries: ChapterQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    author_id = get_book_author(book_id)
    if author_id == account_data["id"]:
        chapters = queries.get_chapters_by_book_id(book_id)
        return {"chapters": chapters}


@router.put(
    "/api/books/{book_id}/chapters/{chapter_id}",
    tags=["Chapters"],
    response_model=ChapterOut,
)
def update_chapter(
    book_id: int,
    chapter_id: int,
    chapter: ChapterUpdate,
    queries: ChapterQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    book_author = get_book_author(book_id)
    if book_author != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to update this chapter.",
        )
    try:
        return queries.update_chapter(chapter_id, chapter)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500, detail="Could not update chapter."
        )


@router.put(
    "/api/books/{book_id}/chapters", tags=["Chapters"], response_model=Message
)
def update_chapter_order(
    book_id: int,
    chapter_list: ChapterOrderUpdateList,
    queries: ChapterQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    book_author = get_book_author(book_id)
    if book_author != account_data["id"]:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to update these chapters",
        )
    try:
        return queries.update_chapter_order(chapter_list)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500, detail="Could not update chapter."
        )


@router.get(
    "/api/authors/{author_id}/chapters",
    tags=["Chapters"],
)
def get_recent_chapters_by_author(
    author_id: int,
    limit: int = 10,
    offset: int = 0,
    queries: ChapterQueries = Depends(),
):
    return queries.get_recent_chapters_by_author(author_id, limit, offset)
