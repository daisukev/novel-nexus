from fastapi import APIRouter, Depends, Response, HTTPException
from queries.books import (
    BookInNew,
    BookRepository,
    BookOut,
    BookUpdate,
    Error,
)

from typing import Union, List, Optional
from authenticator import authenticator

router = APIRouter()


@router.post(
    "/api/books", tags=["Books"], response_model=Union[BookOut, Error]
)
def create_book(
    book: BookInNew,
    response: Response,
    repo: BookRepository = Depends(),
    account: dict = Depends(authenticator.get_current_account_data),
):
    author_id = account["id"]
    try:
        return repo.create(book, author_id)
    except Exception as e:
        error_detail = str(e)
        raise HTTPException(status_code=response, detail=error_detail)


@router.get(
    "/api/books", tags=["Books"], response_model=Union[List[BookOut], Error]
)
def get_all(repo: BookRepository = Depends()):
    return repo.get_all()


@router.get(
    "/api/my/books/", tags=["Books", "Authors"], response_model=List[BookOut]
)
def get_books_by_author(
    repo: BookRepository = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    author_id = account_data["id"]
    return repo.get_books_by_author(author_id)


@router.put(
    "/api/books/{book_id}",
    tags=["Books"],
    response_model=Union[BookOut, Error],
)
def update_book(
    book_id: int, book: BookUpdate, repo: BookRepository = Depends()
) -> Union[Error, BookOut]:
    return repo.update(book_id, book)


@router.delete("/api/books/{book_id}", tags=["Books"], response_model=bool)
def delete_book(
    book_id: int,
    repo: BookRepository = Depends(),
) -> bool:
    return repo.delete(book_id)


@router.get(
    "/api/books/{book_id}", tags=["Books"], response_model=Optional[BookOut]
)
def get_one_book(
    book_id: int, response: Response, repo: BookRepository = Depends()
) -> BookOut:
    book = repo.get_one(book_id)
    if book is None:
        response.status_code = 404
    return book
