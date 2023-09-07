from models.follows import FollowedList
from models.follows import FollowResponse, UnfollowResponse
from fastapi import APIRouter, Depends, HTTPException
from queries.follows import FollowQueries
from authenticator import authenticator

router = APIRouter()


@router.post(
    "/api/author/{follower_id}/follow/{author_id}",
    tags=["Follow"],
    response_model=FollowResponse,
)
def create_follow(
    follower_id: int,
    author_id: int,
    queries: FollowQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    if account_data["id"] != follower_id:
        raise HTTPException(status_code=403, detail="Permission Denied")

    success = queries.follow(follower_id, author_id)
    if not success:
        raise HTTPException(status_code=500, detail="Following Request Failed")
    return {"is_following": success}


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
    "/api/author/{follower_id}/unfollow/{author_id}",
    tags=["Follow"],
    response_model=UnfollowResponse,
)
def unfollow_author(
    follower_id: int,
    author_id: int,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: FollowQueries = Depends(),
):
    if account_data["id"] != follower_id:
        raise HTTPException(status_code=403, detail="Permission Denied")

    success = queries.unfollow_author(follower_id, author_id)

    return {"is_not_following": success}
