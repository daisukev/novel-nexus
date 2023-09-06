from typing import List
from api_pool import pool
from models.genres import Genre
from models.genres_books import GenreBook
from fastapi import HTTPException
from queries.books import BookOut


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

    def get_books(self, genre: str) -> List[BookOut]:
        try:
            # Connect to the database
            with pool.connection() as conn:
                # Get a cursor (something to run SQL with)
                with conn.cursor() as db:
                    # Run our SELECT statement
                    db.execute(
                        """
                        SELECT b.id, b.title, b.author_id, b.summary,
                        b.cover, b.is_published
                        FROM books b
                        JOIN genres_books bg ON b.id = bg.book_id
                        JOIN genres g ON bg.genre_id = g.id
                        WHERE g.name = %s AND b.is_published = true;
                        """,
                        (genre,),
                    )

                    # Fetch all rows
                    books = db.fetchall()

                    # Create a list of dictionaries with column names as keys
                    book_list = []
                    for book in books:
                        book_dict = {
                            "id": book[0],
                            "title": book[1],
                            "author_id": book[2],
                            "summary": book[3],
                            "cover": book[4],
                            "is_published": book[5],
                        }
                        book_list.append(book_dict)
                    if not book_list:
                        raise Exception()
                    return book_list

        except Exception as e:
            print("An error occurred:", e)
            return []
