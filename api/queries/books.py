# from psycopg_pool import ConnectionPool
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List, Union
from datetime import datetime
from api_pool import pool

# pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class BookIn(BaseModel):
    title: str
    author_id: Optional[int]
    summary: Optional[str]
    cover: Optional[str] = Field(None, max_length=255)
    is_published: Optional[bool] = Field(default=False)
    created_at: datetime = Field(default_factory=datetime)
    updated_at: Optional[datetime]


class BookInNew(BaseModel):
    title: str


class BookOut(BaseModel):
    id: int
    title: Optional[str]
    author_id: Optional[int]
    summary: Optional[str]
    cover: Optional[str] = Field(None, max_length=255)
    is_published: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime)
    updated_at: Optional[datetime]


class BooksAuthorsOut(BaseModel):
    id: int
    title: Optional[str]
    author_id: Optional[int]
    summary: Optional[str]
    cover: Optional[str] = Field(None, max_length=255)
    is_published: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime)
    updated_at: Optional[datetime]
    author_first_name: Optional[str]
    author_last_name: Optional[str]
    author_username: str


class BookUpdate(BaseModel):
    title: Optional[str]
    summary: Optional[str]
    cover: Optional[str]
    is_published: Optional[bool]


class Error(BaseModel):
    message: str


class SearchOut(BaseModel):
    id: int
    title: Optional[str]
    summary: Optional[str]
    cover: Optional[HttpUrl]
    author_id: int
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    genres: Optional[List[Union[str, None]]]


class SearchListOut(BaseModel):
    books: List[SearchOut]


class RecentBooksOut(BaseModel):
    id: int
    title: Optional[str]
    cover: Optional[str]
    created_at: Optional[datetime]
    is_published: Optional[bool]


class TopBooksOut(BaseModel):
    id: int
    author_id: Optional[int]
    book_id: Optional[int]
    title: Optional[str]
    cover: Optional[str]
    created_at: datetime = Field(default_factory=datetime)
    updated_at: Optional[datetime]
    is_published: Optional[bool]
    author_first_name: Optional[str]
    author_last_name: Optional[str]
    visits: Optional[int]


class BooksViewOut(BaseModel):
    id: int
    title: Optional[str]
    visits: Optional[int]


class BookRepository:
    def delete(self, book_id: int) -> bool:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor (something to run SQL with)
                with conn.cursor() as db:
                    # Run our SELECT statement
                    db.execute(
                        """
                        DELETE FROM books
                        WHERE id = %s
                        """,
                        [book_id],
                    )
                    return True
        except Exception as e:
            print(e)
            return False

    def get_one(self, book_id: int) -> Optional[BookOut]:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor (something to run SQL with)
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT
                        id,
                        title,
                        author_id,
                        summary,
                        cover,
                        is_published,
                        created_at,
                        updated_at
                        FROM books
                        WHERE id=%s
                        """,
                        [book_id],
                    )
                    record = result.fetchone()
                    if record is None:
                        return None
                    return self.record_to_book_out(record)
        except Exception as e:
            print(e)
            return {"message": "Error at get a book"}

    def update(self, book_id: int, book: BookUpdate) -> Union[dict, Error]:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor (something to run SQL with)
                with conn.cursor() as db:
                    # Run our SELECT statement
                    update_book = book.dict(exclude_unset=True)
                    query_list = []
                    for key, value in update_book.items():
                        query_list.append(f"{key} = %s")
                    db.execute(
                        f"""
                        UPDATE books
                        SET {','.join(query_list)}
                        WHERE id = %s
                        """,
                        [*update_book.values(), book_id],
                    )
                    return {"message": "Successfully updated book!"}
        except Exception:
            return {"message": "Error at update book"}

    def get_all(self) -> Union[Error, List[BooksAuthorsOut]]:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor (something to run SQL with)
                with conn.cursor() as cur:
                    # Run our SELECT statement
                    cur.execute(
                        """
                        SELECT
                        b.id,
                        b.title,
                        b.summary,
                        b.cover,
                        b.is_published,
                        b.created_at,
                        b.updated_at,
                        a.id AS author_id,
                        a.first_name AS author_first_name,
                        a.last_name AS author_last_name,
                        a.username AS author_username
                        FROM
                        books b
                        JOIN authors a ON b.author_id = a.id
                        WHERE
                        b.is_published = TRUE
                        ORDER BY
                        b.title;
                        """
                    )
                    results = []
                    all = cur.fetchall()
                    for row in all:
                        record = {}
                        for i, column in enumerate(cur.description):
                            record[column.name] = row[i]
                        results.append(BooksAuthorsOut(**record))

                    return results

        except Exception as e:
            print(e)
            return {"message": "Error at get all books"}

    def get_books_by_author(
        self, author_id: int
    ) -> Union[Error, List[BookOut]]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute(
                        """
                        SELECT id,
                        author_id,
                        title,
                        summary,
                        cover,
                        is_published,
                        created_at,
                        updated_at
                        FROM books
                        WHERE author_id = %s
                        """,
                        [author_id],
                    )

                    results = []
                    for row in cur.fetchall():
                        record = {}
                        for i, column in enumerate(cur.description):
                            record[column.name] = row[i]
                        results.append(BookOut(**record))

                    return results
                except Exception as e:
                    print(e)

    def create(self, book: BookInNew, author_id: int) -> Union[BookOut, Error]:
        try:
            # connect to the database
            with pool.connection() as conn:
                # get a cursor (something to run SQL with)
                with conn.cursor() as db:
                    # Run our INSERT statement
                    db.execute(
                        """
                        INSERT INTO books
                        (title, author_id)
                        VALUES
                        (%s, %s)
                        RETURNING
                        id,
                        title,
                        author_id,
                        summary,
                        cover,
                        is_published,
                        created_at,
                        updated_at;
                        """,
                        [
                            book.title,
                            author_id,
                        ],
                    )
                    row = db.fetchone()

                    if row is not None:
                        record = {}
                        for (
                            i,
                            column,
                        ) in enumerate(db.description):
                            record[column.name] = row[i]
                        return BookOut(**record)
        except Exception as e:
            return {"message": str(e)}

    def book_in_to_out(self, id: int, book: BookIn):
        old_data = book.dict()
        return BookOut(id=id, **old_data)

    def record_to_book_out(self, record):
        return BookOut(
            id=record[0],
            title=record[1],
            author_id=record[2],
            summary=record[3],
            cover=record[4],
            is_published=record[5],
            created_at=record[6],
            updated_at=record[7],
        )

    def search(self, q: str) -> Union[Error, List[BookOut]]:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor (something to run SQL with)
                with conn.cursor() as db:
                    # Run our SELECT statement

                    db.execute(
                        """
                    SELECT DISTINCT
                    ON (b.id, b.title)
                    b.id,
                    b.title,
                    b.summary,
                    b.cover,
                    a.username,
                    a.first_name,
                    a.last_name,
                    a.id as author_id,
                    ARRAY_AGG(DISTINCT g.name) AS genres
                    FROM
                    books b
                    LEFT JOIN authors a ON b.author_id = a.id
                    LEFT JOIN genres_books gb ON b.id = gb.book_id
                    LEFT JOIN genres g ON gb.genre_id = g.id
                    WHERE
                    (
                        SELECT
                        bool_or(b.title ILIKE '%%' || word || '%%')
                        OR bool_or(b.summary ILIKE '%%' || word || '%%')
                        OR bool_or(a.username ILIKE '%%' || word || '%%')
                        OR bool_or(a.first_name ILIKE '%%' || word || '%%')
                        OR bool_or(a.last_name ILIKE '%%' || word || '%%')
                        OR bool_or(g.name ILIKE '%%' || word || '%%')
                        FROM
                        unnest(string_to_array(%s, ' ')) AS word
                    )
                    AND b.is_published = True
                    GROUP BY
                    b.id,
                    b.title,
                    b.summary,
                    b.cover,
                    a.id,
                    a.username,
                    a.first_name,
                    a.last_name
                    ORDER BY b.title;
                    """,
                        (f"%{q}%",),
                    )
                    results = []
                    for row in db.fetchall():
                        record = {}
                        for i, column in enumerate(db.description):
                            record[column.name] = row[i]
                        results.append(SearchOut(**record))
                    if not results:
                        raise Exception()
                    return SearchListOut(books=results)
        except Exception as e:
            print(e)
            return SearchListOut(books=[])

    def get_recent_books(self) -> Union[Error, List[RecentBooksOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT
                            id,
                            title,
                            cover,
                            created_at,
                            is_published
                        FROM
                            books
                        WHERE
                            is_published = TRUE
                        ORDER BY
                            created_at DESC;
                        """
                    )
                    results = []
                    record = cur.fetchall()
                    for row in record:
                        data = {}
                        for i, column in enumerate(cur.description):
                            data[column.name] = row[i]
                        results.append(RecentBooksOut(**data))
                    return results
        except Exception as e:
            print(e)

    def book_views_counter(self) -> Union[Error, List[BooksViewOut]]:
        try:
            updated_books = []
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        UPDATE popular_books
                        SET visits = visits + 1
                        RETURNING id, title, visits;
                        """
                    )
                    updated_books_data = cur.fetchall()
                    for book_data in updated_books_data:
                        updated_books.append(
                            {
                                "id": book_data[0],
                                "title": book_data[1],
                                "visits": book_data[2],
                            }
                        )
            conn.commit()
            return updated_books
        except Exception as e:
            print(e)

    def get_top_books(self, limit: int) -> Union[Error, List[TopBooksOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT
                            p.id,
                            p.title,
                            p.cover,
                            p.is_published,
                            p.created_at,
                            p.updated_at,
                            p.visits,
                            p.book_id,
                            a.id AS author_id,
                            a.first_name AS author_first_name,
                            a.last_name AS author_last_name
                        FROM
                        popular_books p
                        JOIN authors a ON p.author_id = a.id
                        WHERE
                            is_published = TRUE
                        ORDER BY
                            visits DESC
                        LIMIT %s;
                        """,
                        (limit,),
                    )
                    results = []
                    record = cur.fetchall()
                    for row in record:
                        data = {}
                        for i, column in enumerate(cur.description):
                            data[column.name] = row[i]
                        results.append(TopBooksOut(**data))
                    return results
        except Exception as e:
            print(e)

    def get_published_books_by_author(
        self, author_id: int
    ) -> Union[Error, List[BookOut]]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute(
                        """
                        SELECT id,
                        author_id,
                        title,
                        summary,
                        cover,
                        is_published,
                        created_at,
                        updated_at
                        FROM books
                        WHERE author_id = %s
                        AND is_published= true
                        """,
                        [author_id],
                    )

                    results = []
                    for row in cur.fetchall():
                        record = {}
                        for i, column in enumerate(cur.description):
                            record[column.name] = row[i]
                        results.append(BookOut(**record))

                    return results
                except Exception as e:
                    print(e)

    def get_some_books(
        self, limit: int = 10, offset: int = 0
    ) -> Union[Error, List[BooksAuthorsOut]]:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor (something to run SQL with)
                with conn.cursor() as cur:
                    # Run our SELECT statement
                    cur.execute(
                        """
                        SELECT
                        b.id,
                        b.title,
                        b.summary,
                        b.cover,
                        b.is_published,
                        b.created_at,
                        b.updated_at,
                        a.id AS author_id,
                        a.first_name AS author_first_name,
                        a.last_name AS author_last_name,
                        a.username AS author_username
                        FROM
                        books b
                        JOIN authors a ON b.author_id = a.id
                        WHERE
                        b.is_published = TRUE
                        ORDER BY
                        b.title
                        LIMIT %s OFFSET %s;
                        """,
                        [limit, offset],
                    )
                    results = []
                    all = cur.fetchall()
                    for row in all:
                        record = {}
                        for i, column in enumerate(cur.description):
                            record[column.name] = row[i]
                        results.append(BooksAuthorsOut(**record))

                    return results

        except Exception as e:
            print(e)
            return {"message": "Error at get all books"}
