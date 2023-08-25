from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from models.chapters import ChapterOut, ChapterIn, ChapterListOut
from queries.chapters import ChapterQueries
from authenticator import authenticator
from utils import get_book_author

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



@router.post("/api/chapters", response_model=ChapterListOut)
async def create_chapters(
    chapter: ChapterIn,
    queries: ChapterQueries = Depends(),
):
    created_chapter = queries.create_chapter(chapter)
    return {"chapters": [created_chapter]}


@router.get("/api/books/{book_id}/chapters", response_model=ChapterListOut)
def get_all_chapters_by_book_id(
    book_id: int,
    queries: ChapterQueries = Depends(),
):
    chapters = queries.get_chapters_by_book_id(book_id)
    return {"chapters": chapters}
