from api_pool import pool


def get_book_author(book_id: int) -> int | None:
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
            SELECT author_id from books
            where id = %s;
            """,
                (book_id,),
            )
            row = cur.fetchone()
            if row is not None:
                print("row: ", row[0])
                return row[0]
