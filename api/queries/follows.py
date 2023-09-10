import os
from typing import List, Union

from fastapi import HTTPException
from models.authors import AuthorListOut, AuthorOut
from models.follows import FollowRequest
from psycopg_pool import ConnectionPool

pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class FollowQueries:
    def follow(self, follower_id: int, author_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        INSERT INTO follows (follower_id, author_id)
                        VALUES (%s, %s)
                        RETURNING follower_id, author_id
                        """,
                        (follower_id, author_id),
                    )
                    conn.commit()
            return True
        except Exception as e:
            print(f"Error while following: {e}")
            return False

    def is_following(self, follower_id: int, author_id: int) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as db:
                try:
                    db.execute(
                        """
                        SELECT * from follows
                        where follower_id = %s and author_id = %s;
                        """,
                        (follower_id, author_id),
                    )
                    result = db.fetchall()
                    if len(result) > 0:
                        return True
                    return False
                except Exception as e:
                    print(e)
                    raise HTTPException(
                        status_code=500, detail="Could not complete request."
                    )

    def following_list(
        self, follower_id: int
    ) -> Union[List[FollowRequest], None]:
        followed_authors = []
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                        SELECT author_id
                        FROM follows
                        WHERE follower_id = %s
                        """,
                    (follower_id,),
                )

                records = db.fetchall()
                if not records:
                    return None

                for record in records:
                    is_following = True
                    followed_authors.append(
                        FollowRequest(
                            author_id=record[0], is_following=is_following
                        )
                    )

        return followed_authors

    def unfollow_author(self, follower_id: int, author_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE
                        FROM follows
                        WHERE follower_id = %s AND author_id = %s
                        """,
                        (follower_id, author_id),
                    )
                    conn.commit()
                return True
        except Exception as e:
            print(f"Error while unfollowing {e}")
            return False

    def get_followed_authors(self, follower_id: int) -> AuthorListOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute(
                        """SELECT a.id, a.username,
                        a.biography, a.avatar,
                        a.first_name,
                        a.last_name from follows f
                        JOIN authors a ON f.author_id = a.id
                        WHERE f.follower_id= %s
                        ORDER BY a.username ASC;
                        """,
                        (follower_id,),
                    )
                    results = []
                    for row in cur.fetchall():
                        record = {}
                        for i, column in enumerate(cur.description):
                            record[column.name] = row[i]
                        results.append(AuthorOut(**record))

                    return AuthorListOut(authors=results)
                except Exception as e:
                    print(e)
