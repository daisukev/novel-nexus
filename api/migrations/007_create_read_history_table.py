steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE read_history (
            "author_id" INTEGER REFERENCES authors(id) ON DELETE CASCADE,
            "chapter_id" INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
            "book_id" INTEGER REFERENCES books(id) ON DELETE CASCADE,
            "read_at" TIMESTAMP DEFAULT (NOW()),
            CONSTRAINT read_history_pk PRIMARY KEY (author_id, chapter_id)
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE "read_history";
        """,
    ]
]
