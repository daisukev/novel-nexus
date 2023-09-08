import os
from fastapi import HTTPException

from psycopg_pool import ConnectionPool
from typing import List
from models.authors import Message
from models.chapters import (
    AllChaptersOut,
    AuthorChapterOut,
    ChapterIn,
    ChapterOrderUpdateList,
    ChapterOut,
    ChapterUpdate,
    PublishedChaptersOut,
)

from psycopg.errors import DatabaseError

pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class ChapterQueries:
    def create_chapter(self, chapter: ChapterIn, book_id: int) -> ChapterOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute(
                        """
                        INSERT INTO
                            chapters (book_id, chapter_order, title,
                            content)
                        VALUES
                            (%s, %s, %s, %s)
                        RETURNING id, book_id, chapter_order, title,
                                content, views,
                                is_published, created_at, updated_at;
                        """,
                        [
                            book_id,
                            chapter.chapter_order,
                            chapter.title,
                            chapter.content,
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
                except Exception as e:
                    print(e)

    def get_all_published_chapters_by_book_id(
        self, book_id: int
    ) -> List[PublishedChaptersOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT
                        c.id,
                        c.book_id,
                        c.chapter_order,
                        c.title,
                        c.views,
                        c.updated_at,
                        c.created_at
                    FROM
                        chapters c
                    WHERE
                        c.book_id = %s
                    AND
                        c.is_published = true
                    ORDER BY
                        c.chapter_order;
                    """,
                    (book_id,),
                )
                results = []
                for row in cur.fetchall():
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]
                    results.append(PublishedChaptersOut(**record))
        return results

    def get_chapters_by_book_id(self, book_id: int) -> List[AllChaptersOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT
                        c.id,
                        c.book_id,
                        c.chapter_order,
                        c.title,
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
                results = []
                for row in cur.fetchall():
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]
                    results.append(AllChaptersOut(**record))
        return results

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

    def get_chapters(self) -> List[ChapterOut]:
        chapters = []
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    SELECT id, book_id, chapter_order,  title, content,
                    views, is_published, created_at, updated_at
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

    def update_chapter(
        self, chapter_id: int, chapter: ChapterUpdate
    ) -> ChapterOut | None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                update_chapter = chapter.dict(exclude_unset=True)
                query_list = []
                for key, value in update_chapter.items():
                    query_list.append(f"{key} = %s")
                cur.execute(
                    f"""
                    UPDATE chapters
                    SET {', '.join(query_list)}
                    WHERE id=%s
                    RETURNING *;
                    """,
                    (*update_chapter.values(), chapter_id),
                )
                row = cur.fetchone()
                print(row)
                if row is not None:
                    record = {}
                    for (
                        i,
                        column,
                    ) in enumerate(cur.description):
                        record[column.name] = row[i]
                else:
                    return None

                return ChapterOut(**record)

    def update_chapter_order(
        self, chapter_list: ChapterOrderUpdateList
    ) -> Message:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                chapters = [
                    chapter.dict() for chapter in chapter_list.chapters
                ]
                try:
                    for chapter in chapters:
                        print(chapter)
                        query = """
                        UPDATE chapters
                        SET chapter_order = %s
                        WHERE id = %s
                        """
                        cur.execute(
                            query, (chapter["chapter_order"], chapter["id"])
                        )
                    conn.commit()
                    return Message(message="Updated Successfully.")
                except DatabaseError as e:
                    conn.rollback()
                    raise HTTPException(
                        status_code=403,
                        detail=f"""Database error has occurred.
                        Rolling back update. {e}""",
                    )

    def get_published_chapters(self, chapter_id) -> ChapterOut | None:
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
                            c.id = %s
                            AND c.is_published = true
                        """,
                    [chapter_id],
                )

                row = cur.fetchone()
                return self.chapter_record_to_dict(row, cur.description)

    def get_recent_chapters_by_author(
        self, author_id: int, limit: int = 10, offset: int = 0
    ):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT c.id as chapter_id,
                    b.cover,
                    b.id as book_id,
                    c.title as chapter_title,
                    b.title as book_title,
                    c.updated_at
                    FROM chapters c
                    INNER JOIN books b ON c.book_id = b.id
                    INNER JOIN authors a ON b.author_id = a.id
                    WHERE a.id = %s and c.is_published = true
                    AND c.updated_at IS NOT NULL
                    ORDER BY c.updated_at DESC
                    LIMIT %s OFFSET %s;
                    """,
                    [author_id, limit, offset],
                )
                results = []
                for row in cur.fetchall():
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]
                    results.append(AuthorChapterOut(**record))
        return results
