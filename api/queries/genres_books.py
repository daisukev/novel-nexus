from typing import List
from api_pool import pool
from models.genres import Genre
from models.genres_books import GenreBook
from fastapi import HTTPException


class GenresBooksQueries:
    def add_genre_book(self, genre_id: int, book_id: int) -> GenreBook | None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute(
                        """
                        INSERT INTO genres_books (genre_id, book_id)
                        VALUES (%s, %s)
                        RETURNING genre_id, book_id;
                        """,
                        (genre_id, book_id),
                    )
                    conn.commit()
                except Exception as e:
                    print(e)
                    raise HTTPException(
                        status_code=409, detail="Could not add genre to book."
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

                return GenreBook(**record)

    def get_book_genres(self, book_id: int) -> List[Genre]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT g.id, g.name
                    FROM genres_books gb
                    JOIN genres g on g.id = gb.genre_id
                    where book_id = (%s)
                    """,
                    (book_id,),
                )

                results = []
                for row in cur.fetchall():
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]
                    results.append(Genre(**record))

                print("genres: ", results)
                return results

    def delete_genre_book(self, book_id, genre_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM genres_books
                    where book_id = %s AND genre_id = %s
                    """,
                    (book_id, genre_id),
                )
