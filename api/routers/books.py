from fastapi import (
    APIRouter,
    Depends,
    Query,
    Response,
    HTTPException,
    UploadFile,
)
from queries.books import (
    BookInNew,
    BookRepository,
    BookOut,
    BookUpdate,
    BooksAuthorsOut,
    Error,
    SearchListOut,
    RecentBooksOut,
    PopularBookListOut,
    PopularBookOut,
)

from typing import Union, List, Optional
from authenticator import authenticator
from utils import get_book_author, upload_image

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
    "/api/books",
    tags=["Books"],
    response_model=Union[List[BooksAuthorsOut], Error],
)
def get_all(
    limit: int = Query(None, description="Limit to the number of results"),
    offset: int = Query(
        None, description="Starting point from where to fetch results"
    ),
    repo: BookRepository = Depends(),
):
    if limit is None and offset is None:
        return repo.get_all()
    else:
        return repo.get_some_books(limit, offset)


@router.get(
    "/api/my/books", tags=["Books", "Authors"], response_model=List[BookOut]
)
def get_books_by_author(
    repo: BookRepository = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    author_id = account_data["id"]
    return repo.get_books_by_author(author_id)


@router.get(
    "/api/books/search",
    tags=["Books"],
    response_model=SearchListOut,
)
def get_books_by_search(
    q: str, repo: BookRepository = Depends()
) -> SearchListOut:
    exclude_set = {
        "a",
        "an",
        "the",
        "in",
        "of",
        "on",
        "are",
        "be",
        "if",
        "into",
        "which",
    }
    query_list = set(q.split())
    filteredQuery = " ".join(list(query_list.difference(exclude_set))).strip()
    if filteredQuery == "":
        return repo.search(q)
    return repo.search(filteredQuery)


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


@router.post(
    "/api/books/{book_id}/cover",
    tags=["Books", "Image Upload"],
)
async def upload_cover_image(
    image: UploadFile,
    book_id: int,
    repo: BookRepository = Depends(),
    account: dict = Depends(authenticator.get_current_account_data),
):
    author = get_book_author(book_id)
    if author != account["id"]:
        raise HTTPException(
            status_code=403, detail="Book Covers must be updated by author."
        )

    image_href = await upload_image(image)
    if not image_href:
        raise HTTPException(status_code=400, detail="Something went wrong.")
    update_book = BookUpdate(cover=image_href["href"])
    repo.update(book_id, update_book)

    return image_href


@router.get(
    "/api/recent/books",
    tags=["Books"],
    response_model=Union[List[RecentBooksOut], Error],
)
def get_recent_books(repo: BookRepository = Depends()):
    try:
        recent_books = repo.get_recent_books()
        if recent_books:
            return recent_books
        else:
            raise HTTPException(
                status_code=404, detail="No recent books found"
            )
    except Exception as e:
        error_message = str(e)
        return Error(message=error_message)


@router.get(
    "/api/popular/books", tags=["Popular"], response_model=PopularBookListOut
)
def get_popular_books(repo: BookRepository = Depends()) -> PopularBookListOut:
    popular_books = repo.get_popular_books()
    return PopularBookListOut(popular=popular_books)


@router.get(
    "/api/books/popular/{book_id}/views",
    tags=["Popular"],
    response_model=PopularBookOut,
)
def get_book_view_count(
    book_id: int, queries: BookRepository = Depends()
) -> PopularBookOut:
    return queries.get_popular_book_by_book_id(book_id)


@router.get(
    "/api/authors/{author_id}/books",
    tags=["Books", "Authors"],
    response_model=List[BookOut],
)
def get_published_books_by_author(
    author_id: int,
    repo: BookRepository = Depends(),
):
    return repo.get_published_books_by_author(author_id)
