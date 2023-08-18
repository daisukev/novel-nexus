import os

from fastapi import HTTPException
from psycopg_pool import ConnectionPool
from psycopg import IntegrityError
from models.authors import (
    AuthorOut,
    AuthorListOut,
    AuthorPasswordOut,
    AuthorUpdate,
    AuthorIn,
)
from typing import List
from pydantic import HttpUrl, SecretStr

pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class AuthorQueries:
    def create_author(self, author: AuthorIn) -> AuthorPasswordOut | None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                username = author.username
                password = author.password
                try:
                    cur.execute(
                        """
                        INSERT INTO authors (username, password)
                        VALUES (%s, %s)
                        RETURNING
                        id,
                        username,
                        password;
                        """,
                        [username, password],
                    )
                    conn.commit()
                except IntegrityError as e:
                    if (
                        "duplicate key value violates unique constraint"
                        in str(e)
                    ):
                        raise HTTPException(
                            status_code=403,
                            detail=f"User '{username}' already exists.",
                        )

                record = None
                row = cur.fetchone()
                if row is not None:
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]
                else:
                    return None
                return AuthorPasswordOut(**record)

    def get_author_by_username(
        self, username: str
    ) -> AuthorPasswordOut | None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT
                           id,
                           username,
                           password,
                           first_name,
                           last_name,
                           biography,
                           avatar,
                           created_at,
                           email
                    FROM authors
                    WHERE username = %s
                    """,
                    [username],
                )

                record = None
                row = cur.fetchone()
                print("row: ", row)
                if row is not None:
                    record = {}
                    for (
                        i,
                        column,
                    ) in enumerate(cur.description):
                        record[column.name] = row[i]
                else:
                    return None

                return AuthorPasswordOut(**record)

    def get_all_authors(self) -> List[AuthorListOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, username, created_at,
                        biography, avatar, first_name,
                        last_name
                    FROM authors
                    ORDER BY last_name, first_name
                    """
                )

                results = []
                for row in cur.fetchall():
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]
                    results.append(AuthorOut(**record))

                return results

    def get_author_by_id(self, author_id: int) -> AuthorOut | None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, first_name, last_name,
                        biography, avatar, created_at, username
                    FROM authors
                    WHERE id = %s
                    """,
                    [author_id],
                )

                record = None
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

                return AuthorOut(**record)

    def update_author(
        self, author_id: int, author: AuthorUpdate
    ) -> AuthorUpdate | None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                update_author = author.dict(exclude_unset=True)
                query_list = []
                for key, value in update_author.items():
                    if isinstance(value, SecretStr):
                        value = value.get_secret_value()
                    if isinstance(value, HttpUrl):
                        value = str(value)
                    query_list.append(f"{key} = %s")
                cur.execute(
                    f"""
                    UPDATE authors
                    SET {', '.join(query_list)}
                    WHERE id=%s
                    RETURNING *;
                    """, (*update_author.values(), author_id)
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

                return AuthorUpdate(**record)

    def delete_author(self, author_id: int) -> None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE from authors
                    WHERE id = %s;
                    """,
                    [author_id],
                )
