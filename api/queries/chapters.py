import os
from psycopg_pool import ConnectionPool
from typing import List
from models.chapters import ChapterOut

pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class ChapterQueries:
    def get_chapters(self) -> List[ChapterOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT
                        c.id AS chapter_id,
                        c.book_id,
                        c.chapter_order,
                        c.title,
                        c.content,
                        c.views,
                        c.is_published
                    FROM
                        chapters c
                    ORDER BY
                        c.chapter_order;
                    """
                )
                chapters = []
                rows = cur.fetchall()
                for row in rows:
                    chapter = self.chapter_record_to_dict(row, cur.description)
                    chapters.append(chapter)
                return chapters

    def get_chapter(self, chapter_id) -> ChapterOut | None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT
                        c.id AS chapter_id,
                        c.book_id,
                        c.chapter_order,
                        c.title,
                        c.content,
                        c.views,
                        c.is_published
                    FROM
                        chapters c
                    WHERE
                        c.id = %s;
                    """,
                    [chapter_id],
                )

                row = cur.fetchone()
                return self.chapter_record_to_dict(row, cur.description)

    def delete_chapter(self, chapter_id) -> None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM
                        chapters
                    WHERE
                        id = %s;
                    """,
                    [chapter_id],
                )

    def create_chapter(self, chapter) -> ChapterOut | None:
        id = None
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO
                        chapters (book_id,
                        chapter_order, title,
                        content, views, is_published)
                    VALUES
                        (%s, %s, %s, %s, 0, false)
                    RETURNING
                        id, book_id, chapter_order,
                        title, content, views, is_published;
                    """,
                    [
                        chapter.book_id,
                        chapter.chapter_order,
                        chapter.title,
                        chapter.content,
                    ],
                )
                row = cur.fetchone()
                id = row[0]
        if id is not None:
            return self.get_chapter(id)

    def chapter_record_to_dict(self, row, description) -> ChapterOut | None:
        chapter = None
        if row is not None:
            chapter = {}
            for i, column in enumerate(description):
                if column.name == "chapter_id":
                    chapter["id"] = row[i]
                elif column.name == "book_id":
                    chapter["book_id"] = row[i]
                elif column.name == "chapter_order":
                    chapter["chapter_order"] = row[i]
                elif column.name == "title":
                    chapter["title"] = row[i]
                elif column.name == "content":
                    chapter["content"] = row[i]
                elif column.name == "views":
                    chapter["views"] = row[i]
                elif column.name == "is_published":
                    chapter["is_published"] = row[i]
            return ChapterOut(**chapter)
        return None
