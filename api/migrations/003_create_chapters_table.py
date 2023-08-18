steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE "chapters" (
            "id" SERIAL PRIMARY KEY,
            "chapter_order" INTEGER,
            "book_id" INTEGER,
            "title" VARCHAR(255) NOT NULL,
            "content" TEXT NOT NULL,
            "views" INTEGER DEFAULT 0,
            "is_published" BOOLEAN DEFAULT FALSE,
            "created_at" TIMESTAMP DEFAULT (NOW()),
            "updated_at" TIMESTAMP
        );
        ALTER TABLE "chapters" ADD FOREIGN KEY ("book_id")
        REFERENCES "books" ("id");
        """,
        # "Down" SQL statement
        """
        ALTER TABLE "chapters"
        DROP CONSTRAINT IF EXISTS "chapters_book_id_fkey";
        DROP TABLE "chapters";
        """,
    ]
]
