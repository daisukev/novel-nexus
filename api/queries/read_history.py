from api_pool import pool
from models.read_history import (
    AuthorReadHistory,
    BookViewCount,
    ReadHistory,
)
from fastapi import HTTPException
from psycopg.errors import IntegrityError


class ReadHistoryQueries:
    def add_read_history(
        self, author_id: int, chapter_id: int, book_id: int
    ) -> ReadHistory | None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute(
                        """
                        INSERT INTO read_history
                        (author_id, chapter_id, book_id)
                        VALUES (%s, %s, %s)
                        returning author_id, chapter_id, book_id, read_at;
                        """,
                        (author_id, chapter_id, book_id),
                    )
                    conn.commit()
                except IntegrityError as e:
                    print(e)
                    if "duplicate key value" in str(e):
                        raise HTTPException(
                            status_code=409, detail="Resource already exists."
                        )
                    if "is not present in table" in str(e):
                        raise HTTPException(
                            status_code=404,
                            detail="Cannot add history item."
                            " Chapter does not exist.",
                        )
                    raise HTTPException(
                        status_code=500, detail="Server Error."
                    )

                record = None
                row = cur.fetchone()
                if row is not None:
                    record = {}
                    for (
                        i,
                        column,
                    ) in enumerate(cur.description):
                        record[column.name] = row[i]
                else:
                    return None

                return ReadHistory(**record)

    def delete_read_history(self, author_id: int, chapter_id: int):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM read_history
                    where author_id = %s AND chapter_id = %s
                    """,
                    (author_id, chapter_id),
                )

    def get_author_read_history(self, author_id: int):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT b.title AS book_title,
                    b.cover AS book_cover,
                    c.title AS chapter_title,
                    rh.chapter_id,
                    rh.book_id,
                    read_at
                    FROM read_history rh
                    JOIN books AS b ON b.id = rh.book_id
                    JOIN chapters AS c ON c.id = rh.chapter_id
                    WHERE rh.author_id = %s
                    ORDER BY read_at DESC
                    """,
                    (author_id,),
                )
                results = []
                for row in cur.fetchall():
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]
                    results.append(AuthorReadHistory(**record))

                print("read_history: ", results)
                return results

    def get_book_view_count(self, book_id: int):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT COUNT(book_id) AS views FROM read_history
                    where book_id = %s
                    """,
                    (book_id,),
                )
                record = None
                row = cur.fetchone()
                if row is not None:
                    record = {}
                    for (
                        i,
                        column,
                    ) in enumerate(cur.description):
                        record[column.name] = row[i]
                else:
                    return None

                return BookViewCount(**record)
