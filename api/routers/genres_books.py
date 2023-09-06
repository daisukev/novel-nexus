from typing import Dict
from fastapi import APIRouter, Depends, HTTPException
from models.authors import AuthorOut
from models.genres import Genre
from models.genres_books import GenreBook, GenreBookIn
from queries.genres_books import GenresBooksQueries
from authenticator import authenticator
from utils import get_book_author
from queries.books import (
    BookOut,
    Error,
)

router = APIRouter()


@router.post(
    "/api/books/{book_id}/genres",
    tags=["Genres", "Books"],
    response_model=GenreBook,
)
def add_genre_book(
    book_id: int,
    request: GenreBookIn,
    queries: GenresBooksQueries = Depends(),
    account_data: AuthorOut = Depends(authenticator.get_current_account_data),
) -> GenreBook | None:
    author_id = get_book_author(book_id)
    if author_id == account_data["id"]:
        genre_id = request.genre_id
        return queries.add_genre_book(genre_id, book_id)
    else:
        raise HTTPException(
            status_code=403,
            detail="Forbidden. You cannot alter other author's details.",
        )


@router.get(
    "/api/books/{book_id}/genres",
    tags=["Genres", "Books"],
    response_model=Dict[str, List[Genre]],
)
def get_book_genres(
    book_id: int, queries: GenresBooksQueries = Depends()
) -> Dict[str, List[Genre]]:
    return {"genres": queries.get_book_genres(book_id)}


@router.get(
    "/api/books/genres/{genre}",
    tags=["Genres"],
    response_model=Union[List[BookOut], Error],
)
def get_books_by_genres(
    genre: str, repo: GenresBooksQueries = Depends()
) -> Union[BookOut, Error]:
    return repo.get_books(genre)


@router.delete(
    "/api/books/{book_id}/genres",
    tags=["Genres", "Books"],
    response_model=bool,
)
def delete_genre_book(
    book_id: int,
    request: GenreBookIn,
    queries: GenresBooksQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
) -> bool:
    author_id = get_book_author(book_id)
    if author_id == account_data["id"]:
        genre_id = request.genre_id
        queries.delete_genre_book(book_id=book_id, genre_id=genre_id)
        return True
    else:
        raise HTTPException(
            status_code=403,
            detail="You cannot delete other author's book's genres.",
        )
