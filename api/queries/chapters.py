import os
from psycopg_pool import ConnectionPool
from typing import List
from models.chapters import ChapterIn, ChapterOut

pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class ChapterQueries:
    def create_chapter(self, chapter: ChapterIn) -> ChapterOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO
                        chapters (book_id, chapter_order, title,
                        content, views, is_published)
                    VALUES
                        (%s, %s, %s, %s, %s, %s)
                    RETURNING id, book_id, chapter_order, title,
                            content, views, is_published, created_at, updated_at;
                    """,
                    [
                        chapter.book_id,
                        chapter.chapter_order,
                        chapter.title,
                        chapter.content,
                        0,
                        chapter.is_published,
                    ],
                )
                row = cur.fetchone()
                return ChapterOut(
                    id=row[0],
                    book_id=row[1],
                    chapter_order=row[2],
                    title=row[3],
                    content=row[4],
                    views=row[5],
                    is_published=row[6],
                    created_at=row[7],
                    updated_at=row[8],
                )
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


    def get_chapters_by_book_id(self, book_id: int) -> List[ChapterOut]:
        chapters = []
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    SELECT
                        c.id,
                        c.book_id,
                        c.chapter_order,
                        c.title,
                        c.content,
                        c.is_published,
                        c.views,
                        c.updated_at,
                        c.created_at
                    FROM
                        chapters c
                    WHERE
                        c.book_id = %s
                    ORDER BY
                        c.chapter_order;
                    """,
                    (book_id,),
                )
                chapters = []
                rows = db.fetchall()
                for row in rows:
                    chapter = ChapterOut(
                        id=row[0],
                        book_id=row[1],
                        chapter_order=row[2],
                        title=row[3],
                        content=row[4],
                        views=row[5],
                        is_published=row[6],
                        created_at=row[7],
                        updated_at=row[8],
                    )
                    chapters.append(chapter)
        return chapters

    def get_chapters(self) -> List[ChapterOut]:
        chapters = []
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    SELECT id, book_id, chapter_order,  title, content, views, is_published, created_at, updated_at
                    FROM chapters;
                    """
                )
                rows = db.fetchall()
                for row in rows:
                    chapter = ChapterOut(
                        id=row[0],
                        book_id=row[1],
                        chapter_order=row[2],
                        title=row[3],
                        content=row[4],
                        views=row[5],
                        is_published=row[6],
                        created_at=row[7],
                        updated_at=row[8],
                    )
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
