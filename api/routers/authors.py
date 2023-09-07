from typing import Optional, Union
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    UploadFile,
)
from utils import upload_image

from models.authors import (
    AuthorIn,
    AuthorListOut,
    AuthorOut,
    AuthorUpdate,
    HttpError,
    AccountToken,
    AccountForm,
)
from queries.authors import AuthorQueries
from authenticator import authenticator


router = APIRouter()


@router.get(
    "/token", tags=["Authors", "Auth"], response_model=AccountToken | None
)
async def get_token(
    request: Request,
    queries: AuthorQueries = Depends(),
    account: AuthorOut = Depends(authenticator.try_get_current_account_data),
) -> dict[str, str | AuthorOut] | None:
    if account and authenticator.cookie_name in request.cookies:
        return {
            "access_token": request.cookies[authenticator.cookie_name],
            "type": "Bearer",
            "account": queries.get_author_by_id(account["id"]),
        }


@router.post(
    "/api/authors",
    tags=["Authors", "Auth"],
    response_model=AccountToken | HttpError,
)
async def create_author(
    request: Request,
    response: Response,
    author: AuthorIn,
    queries: AuthorQueries = Depends(),
):
    new_author = queries.create_author(
        AuthorIn(
            username=author.username,
            password=authenticator.hash_password(author.password),
        )
    )
    form = AccountForm(username=author.username, password=author.password)
    token = await authenticator.login(response, request, form, queries)
    return AccountToken(account=new_author, **token.dict())


@router.get("/api/authors/", tags=["Authors"], response_model=AuthorListOut)
def get_authors(queries: AuthorQueries = Depends()):
    return {"authors": queries.get_all_authors()}


@router.get(
    "/api/authors/{identifier}",
    tags=["Authors"],
    response_model=Optional[AuthorOut],
)
def get_author(
    identifier: Union[int, str], queries: AuthorQueries = Depends()
):
    if isinstance(identifier, int):
        record = queries.get_author_by_id(identifier)
        id_str = "id"
    else:
        id_str = "username"
        record = queries.get_author_by_username(identifier)
    if record is None:
        raise HTTPException(
            status_code=404,
            detail=f"No author with {id_str}, '{identifier}' found.",
        )
    return record


@router.delete(
    "/api/authors/{author_id}",
    tags=["Authors"],
    response_model=bool,
)
def delete_author(
    author_id: int,
    queries: AuthorQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    if author_id == account_data["id"]:
        queries.delete_author(author_id)
        authenticator.logout()
        return True
    else:
        raise HTTPException(
            status_code=403, detail="You can only delete your own account"
        )


@router.put(
    "/api/authors/{author_id}",
    tags=["Authors"],
    response_model=Optional[AuthorUpdate],
)
def update_author_by_id(
    author_id: int,
    author: AuthorUpdate,
    queries: AuthorQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    if author_id == account_data["id"]:
        updated_author = author
        if author.password:
            hashed_password = authenticator.hash_password(
                author.password.get_secret_value()
            )
            author_dict = updated_author.dict(exclude_unset=True)
            author_dict["password"] = hashed_password
            updated_author = AuthorUpdate(**author_dict)
        record = queries.update_author(author_id, updated_author)
        if record is None:
            raise HTTPException(
                status_code=404, detail=f"No author with id {author_id} found."
            )
        else:
            return record
    else:
        raise HTTPException(
            status_code=403, detail="You cannot modify other user's data"
        )


@router.post(
    "/api/authors/avatar",
    tags=["Authors", "Image Upload"],
)
async def upload_cover_image(
    image: UploadFile,
    queries: AuthorQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    author_id = account_data["id"]
    image_href = await upload_image(image)
    if not image_href:
        raise HTTPException(status_code=400, detail="Something went wrong.")
    author_update = AuthorUpdate(avatar=image_href["href"])
    queries.update_author(author_id, author_update)

    return image_href
