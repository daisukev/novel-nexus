steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE genres (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR(50) UNIQUE NOT NULL
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE genres;
        """,
    ]
]
