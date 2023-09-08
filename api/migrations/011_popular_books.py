steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE popular_books (
             id SERIAL PRIMARY KEY,
             title VARCHAR(255) NOT NULL,
             cover VARCHAR(255),
             is_published BOOLEAN DEFAULT (FALSE),
             created_at TIMESTAMP DEFAULT (NOW()),
             updated_at TIMESTAMP,
             visits INTEGER,
             book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
             author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE
        );
        """,
        # "Down" SQL statement
        """
        """,
    ]
]
