steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE "books" (
            "id" SERIAL PRIMARY KEY,
            "title" VARCHAR(255) NOT NULL,
            "author_id" INTEGER,
            "summary" TEXT,
            "cover" VARCHAR(255),
            "is_published" BOOLEAN DEFAULT (FALSE),
            "created_at" TIMESTAMP DEFAULT (NOW()),
            "updated_at" TIMESTAMP
        );
        ALTER TABLE "books" ADD FOREIGN KEY ("author_id")
        REFERENCES "authors" ("id");
        """,
        # "Down" SQL statement
        """
        ALTER TABLE "books" DROP CONSTRAINT IF EXISTS "books_author_id_fkey";
        DROP TABLE "books";
        """,
    ]
]
