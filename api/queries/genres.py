from typing import List
from api_pool import pool
from models.genres import Genre


class GenresQueries:
    def get_all_genres(self) -> List[Genre]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                SELECT id, name FROM genres;
                """
                )

                results = []
                for row in cur.fetchall():
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]
                    results.append(Genre(**record))

                print("results: ", results)
                return results
