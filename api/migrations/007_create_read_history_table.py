steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE read_history (
            "id" SERIAL PRIMARY KEY,
            "user_id" INTEGER,
            "chapter_id" INTEGER,
            "read_at" TIMESTAMP DEFAULT (NOW())
        );
        ALTER TABLE "read_history"
        ADD FOREIGN KEY ("user_id") REFERENCES "authors" ("id");
        ALTER TABLE "read_history"
        ADD FOREIGN KEY ("chapter_id") REFERENCES "chapters" ("id");
        """,
        # "Down" SQL statement
        """
        ALTER TABLE "read_history"
        DROP CONSTRAINT IF EXISTS "read_history_user_id_fkey";
        ALTER TABLE "read_history"
        DROP CONSTRAINT IF EXISTS "read_history_chapter_id_fkey";
        DROP TABLE "read_history";
        """,
    ]
]
