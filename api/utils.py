from fastapi import UploadFile, HTTPException
import httpx
from api_pool import pool
import os


def get_book_author(book_id: int) -> int | None:
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
            SELECT author_id from books
            where id = %s;
            """,
                (book_id,),
            )
            row = cur.fetchone()
            if row is not None:
                print("row: ", row[0])
                return row[0]


async def upload_image(image: UploadFile):
    token = os.environ.get("IMAGE_UPLOAD_TOKEN", None)
    if not token:
        return "no token"
    headers = {"Authorization": token}
    image_data = await image.read()

    async with httpx.AsyncClient() as client:
        files = {"image": (image.filename, image_data)}

        content_type = image.content_type
        allowed_types = ["image/jpeg", "image/gif", "image/png"]
        if content_type not in allowed_types:
            raise HTTPException(
                status_code=403,
                detail=f"File must be an image - filetype: {content_type}",
            )
        response = await client.post(
            "https://images.daisuke.dev/images", headers=headers, files=files
        )
        status_code = response.status_code
        new_image = response.json()
        if status_code != 200:
            raise HTTPException(
                status_code=status_code, detail=new_image["message"]
            )

        return new_image
