steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE genres_books (
            "genre_id" INTEGER REFERENCES genres(id),
            "book_id" INTEGER REFERENCES books(id),
            CONSTRAINT genres_books_pk PRIMARY KEY (genre_id, book_id)
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE genres_books;
        """,
    ]
]
