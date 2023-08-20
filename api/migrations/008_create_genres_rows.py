steps = [
    [
        # "Up" SQL statement
        """
        INSERT INTO genres (id, name)
        VALUES 
        (1, 'Fiction'),
        (2, 'Non-Fiction'),
        (3, 'Science Fiction'),
        (4, 'Fantasy'),
        (5, 'Romance'),
        (6, 'Mystery'),
        (7, 'Thriller'),
        (8, 'Biography'),
        (9, 'Memoir'),
        (10, 'Action & Adventure'),
        (11, 'Horror'),
        (12, 'Historical Fiction'),
        (13, 'Literature'),
        (14, 'Contemporary Fiction'),
        (15, 'Poetry'),
        (16, 'Young Adult'),
        (17, 'Children''s'),
        (18, 'Food & Drink'),
        (19, 'Art & Photography'),
        (20, 'Self Help'),
        (21, 'True Crime'),
        (22, 'Humor'),
        (23, 'Religion & Spirituality')
        ON CONFLICT (id) DO NOTHING;
        """,
        # "Down" SQL statement
        """
        TRUNCATE genres CASCADE;
        """,
    ]
]
