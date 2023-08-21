import os
from psycopg_pool import ConnectionPool
from pydantic import BaseModel, Field
from typing import Optional, List, Union
from datetime import datetime

pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class BookIn(BaseModel):
    title: str
    author_id: Optional[int]
    summary: Optional[str]
    cover: Optional[str] = Field(None, max_length=255)
    is_published: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime)
    updated_at: datetime


class BookOut(BaseModel):
    id: int
    title: str
    author_id: Optional[int]
    summary: Optional[str]
    cover: Optional[str] = Field(None, max_length=255)
    is_published: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime)
    updated_at: datetime


class Error(BaseModel):
    message: str


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
                    print("****************")
                    print(record)
                    if record is None:
                        return None
                    return self.record_to_book_out(record)
        except Exception as e:
            print(e)
            return {"message": "Error at get a book"}

    def update(self, book_id: int, book: BookIn) -> Union[BookOut, Error]:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor (something to run SQL with)
                with conn.cursor() as db:
                    # Run our SELECT statement
                    db.execute(
                        """
                        UPDATE books
                        SET
                        title = %s,
                        author_id = %s,
                        summary = %s,
                        cover = %s,
                        is_published = %s,
                        created_at = %s,
                        updated_at = %s
                        WHERE id = %s
                        """,
                        [
                            book.title,
                            book.author_id,
                            book.summary,
                            book.cover,
                            book.is_published,
                            book.created_at,
                            book.updated_at,
                            book_id,
                        ],
                    )
                    return self.book_in_to_out(book_id, book)
        except Exception:
            return {"message": "Error at update book"}

    def get_all(self) -> Union[Error, List[BookOut]]:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor (something to run SQL with)
                with conn.cursor() as db:
                    # Run our SELECT statement
                    result = db.execute(
                        """
                        SELECT id, title, author_id, summary,
                        cover, is_published, created_at,
                        updated_at
                        FROM books
                        ORDER BY id
                        """
                    )
                    return [
                        self.record_to_book_out(record) for record in result
                    ]

        except Exception as e:
            print(e)
            return {"message": "Error at get all books"}

    def create(self, book: BookIn) -> BookOut:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor (something to run SQL with)
                with conn.cursor() as db:
                    # Run our INSERT statement
                    result = db.execute(
                        """
                        INSERT INTO books
                            (title, author_id, summary,
                            cover, is_published, created_at,
                            updated_at)
                        VALUES
                            (%s, %s, %s, %s, %s, %s, %s)
                        RETURNING id;
                        """,
                        [
                            book.title,
                            book.author_id,
                            book.summary,
                            book.cover,
                            book.is_published,
                            book.created_at,
                            book.updated_at,
                        ],
                    )
                    id = result.fetchone()[0]
                    # Return new data
                    return self.book_in_to_out(id, book)
        except Exception as e:
            return {"meesage": e}

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
