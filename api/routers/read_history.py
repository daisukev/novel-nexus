from fastapi import APIRouter, Depends

from models.read_history import (
    BookViewCount,
    ReadHistory,
    ReadHistoryResponse,
)
from authenticator import authenticator
from queries.read_history import ReadHistoryQueries


router = APIRouter()


@router.get(
    "/api/my/history",
    tags=["Read History"],
    response_model=ReadHistoryResponse,
)
def get_author_read_history(
    queries: ReadHistoryQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
) -> ReadHistoryResponse:
    author_id = account_data["id"]
    return {"read_history": queries.get_author_read_history(author_id)}


@router.post(
    "/api/books/{book_id}/chapters/{chapter_id}/history",
    tags=["Read History"],
    response_model=ReadHistory,
)
def add_read_history(
    chapter_id: int,
    book_id: int,
    queries: ReadHistoryQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
) -> ReadHistory | None:
    author_id = account_data["id"]
    return queries.add_read_history(author_id, chapter_id, book_id)


@router.delete(
    "/api/chapters/{chapter_id}/history",
    tags=["Read History"],
    response_model=ReadHistory,
)
def delete_read_history(
    chapter_id: int,
    queries: ReadHistoryQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
) -> bool:
    author_id = account_data["id"]
    queries.delete_read_history(author_id, chapter_id)
    return True


@router.get(
    "/api/books/{book_id}/views",
    tags=["Books", "Read History"],
    response_model=BookViewCount,
)
def get_book_view_count(
    book_id: int, queries: ReadHistoryQueries = Depends()
) -> BookViewCount:
    return queries.get_book_view_count(book_id)
