import os
from typing import List, Union
from models.follows import FollowRequest
from psycopg_pool import ConnectionPool

pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class FollowQueries:
    def follow(self, follower_id: int, author_id: int) -> str:
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
            return f"You successfully started following author {author_id}"
        except Exception as e:
            return str(e)

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
                    followed_authors.append(FollowRequest(author_id=record[0]))

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
            raise False
