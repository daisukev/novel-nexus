steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE follows (
            "id" SERIAL PRIMARY KEY,
            "subscriber_id" INTEGER,
            "author_id" INTEGER,
            "created_at" TIMESTAMP DEFAULT (NOW())
        );
        ALTER TABLE "follows"
        ADD FOREIGN KEY ("subscriber_id") REFERENCES "authors" ("id");
        ALTER TABLE "follows"
        ADD FOREIGN KEY ("author_id") REFERENCES "authors" ("id");
        """,
        # "Down" SQL statement
        """
        ALTER TABLE "follows"
        DROP CONSTRAINT IF EXISTS "follows_subscriber_id_fkey";
        ALTER TABLE "follows"
        DROP CONSTRAINT IF EXISTS "follows_author_id_fkey";
        DROP TABLE follows;
        """,
    ]
]
