from fastapi import APIRouter, Depends, Response, HTTPException
from queries.books import BookIn, BookRepository, BookOut, Error

from typing import Union, List, Optional

router = APIRouter()


@router.post(
    "/api/books", tags=["Books"], response_model=Union[BookOut, Error]
)
def create_book(
    book: BookIn, response: Response, repo: BookRepository = Depends()
):
    try:
        return repo.create(book)
    except Exception as e:
        error_detail = str(e)
        raise HTTPException(status_code=response, detail=error_detail)


@router.get(
    "/api/books", tags=["Books"], response_model=Union[List[BookOut], Error]
)
def get_all(repo: BookRepository = Depends()):
    return repo.get_all()


@router.put(
    "/api/books/{book_id}",
    tags=["Books"],
    response_model=Union[BookOut, Error],
)
def update_book(
    book_id: int, book: BookIn, repo: BookRepository = Depends()
) -> Union[Error, BookOut]:
    return repo.update(book_id, book)


@router.delete("/api/books/{book_id}", tags=["Books"], response_model=bool)
def delete_book(book_id: int, repo: BookRepository = Depends()) -> bool:
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
