steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE "authors" (
            "id" SERIAL PRIMARY KEY,
            "username" VARCHAR(50) UNIQUE NOT NULL,
            "password" VARCHAR(255) NOT NULL,
            "created_at" TIMESTAMP DEFAULT (NOW()),
            "biography" TEXT,
            "avatar" VARCHAR(255),
            "first_name" VARCHAR(255),
            "last_name" VARCHAR(255),
            "email" VARCHAR(255)
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE "authors";
        """,
    ]
]
