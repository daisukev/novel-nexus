steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE genres_books (
            "id" SERIAL PRIMARY KEY,
            "book_id" INTEGER,
            "genre_id" INTEGER
        );
        ALTER TABLE "genres_books"
        ADD FOREIGN KEY ("book_id") REFERENCES "books" ("id");
        ALTER TABLE "genres_books"
        ADD FOREIGN KEY("genre_id") REFERENCES "genres" ("id");
        """,
        # "Down" SQL statement
        """
        ALTER TABLE "genres_books"
        DROP CONSTRAINT IF EXISTS "genres_books_book_id_fkey";
        ALTER TABLE "genres_books"
        DROP CONSTRAINT IF EXISTS "genres_books_genre_id_fkey";
        DROP TABLE genres_books;
        """,
    ]
]
