steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE popular_books (
        popular_id SERIAL PRIMARY KEY,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        chapter_id INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
        visits INTEGER DEFAULT 0
         );
        """,
        # "Down" SQL statement
        """
        """,
    ]
]
