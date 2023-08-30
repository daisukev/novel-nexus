# from psycopg_pool import ConnectionPool
from pydantic import BaseModel, Field
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


class BookUpdate(BaseModel):
    title: Optional[str]
    summary: Optional[str]
    cover: Optional[str]
    is_published: Optional[bool]


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

    def get_all(self) -> Union[Error, List[BookOut]]:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor (something to run SQL with)
                with conn.cursor() as cur:
                    # Run our SELECT statement
                    cur.execute(
                        """
                        SELECT id, title, author_id, summary,
                        cover, is_published, created_at,
                        updated_at
                        FROM books
                        ORDER BY id
                        """
                    )
                    results = []
                    for row in cur.fetchall():
                        record = {}
                        for i, column in enumerate(cur.description):
                            record[column.name] = row[i]
                        results.append(BookOut(**record))
                    print("the query: ", results)

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
                    print("the authors query: ", results)

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
