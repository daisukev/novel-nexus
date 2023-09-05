steps = [
    [
        """    ALTER TABLE "chapters"
        DROP CONSTRAINT "chapters_book_id_fkey",
        ADD CONSTRAINT "chapters_book_id_fkey" FOREIGN KEY ("book_id")
        REFERENCES "books" ("id") ON DELETE CASCADE;
        """,
        """
        ALTER TABLE "chapters"
        DROP CONSTRAINT "chapters_book_id_fkey",
        ADD CONSTRAINT "chapters_book_id_fkey" FOREIGN KEY ("book_id")
        REFERENCES "books" ("id") ON DELETE NO ACTION;
        """,
    ]
]
