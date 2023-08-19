steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE follows (
            follower_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
            author_id  INTEGER REFERENCES authors(id) ON DELETE CASCADE,
            PRIMARY KEY (follower_id, author_id),
            UNIQUE (follower_id, author_id)
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE follows;
        """,
    ]
]
