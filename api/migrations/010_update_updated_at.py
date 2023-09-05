steps = [
    [
        """
        CREATE OR REPLACE FUNCTION update_updated_at()
        RETURNS TRIGGER as $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER books_updated_at_trigger
        BEFORE UPDATE ON books
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();

        CREATE TRIGGER chapters_updated_at_trigger
        BEFORE UPDATE ON chapters
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();
        """,
        """
        DROP TRIGGER books_updated_at_trigger ON books;
        DROP TRIGGER chapters_updated_at_trigger ON chapters;
        DROP FUNCTION update_updated_at();
        """,
    ]
]
