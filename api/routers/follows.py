from models.authors import AuthorListOut
from models.follows import FollowRequest, FollowedList
from models.follows import FollowResponse, UnfollowResponse
from fastapi import APIRouter, Depends, HTTPException
from queries.follows import FollowQueries
from authenticator import authenticator

router = APIRouter()


@router.post(
    "/api/follows",
    tags=["Follow"],
    response_model=FollowResponse,
)
def create_follow(
    followee: FollowRequest,
    queries: FollowQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    follower_id = account_data["id"]
    author_id = followee.author_id
    if account_data["id"] != follower_id:
        raise HTTPException(status_code=403, detail="Permission Denied")

    success = queries.follow(follower_id, author_id)
    if not success:
        raise HTTPException(status_code=500, detail="Following Request Failed")
    return {"is_following": success}


@router.get(
    "/api/authors/{author_id}/is-following",
    tags=["Follow", "Follow"],
    response_model=bool,
)
def is_following(
    author_id: int,
    queries: FollowQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    return queries.is_following(account_data["id"], author_id)


@router.get(
    "/api/author/{follower_id}/followings",
    tags=["Follow", "Follow"],
    response_model=FollowedList,
)
def get_list(
    follower_id: int,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: FollowQueries = Depends(),
):
    if account_data["id"] != follower_id:
        raise HTTPException(status_code=403, detail="Permission Denied")

    followed_authors = queries.following_list(follower_id)
    if not followed_authors:
        raise HTTPException(
            status_code=404, detail="You are not following anyone yet"
        )

    is_following = True

    return FollowedList(
        follower_id=follower_id,
        following=followed_authors,
        is_following=is_following,
    )


@router.delete(
    "/api/follows",
    tags=["Follow"],
    response_model=UnfollowResponse,
)
def unfollow_author(
    follow: FollowRequest,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: FollowQueries = Depends(),
):
    follower_id = account_data["id"]

    author_id = follow.author_id

    if account_data["id"] != follower_id:
        raise HTTPException(status_code=403, detail="Permission Denied")

    success = queries.unfollow_author(follower_id, author_id)

    return {"is_not_following": success}


@router.get("/api/my/follows", tags=["Follow"], response_model=AuthorListOut)
def get_followed_authors(
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: FollowQueries = Depends(),
):
    follower_id = account_data["id"]
    return queries.get_followed_authors(follower_id)
