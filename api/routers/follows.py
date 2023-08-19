from models.follows import FollowedList
from models.follows import FollowResponse, FollowRequest, UnfollowResponse
from fastapi import APIRouter, Depends, HTTPException
from queries.follows import FollowQueries


router = APIRouter()


@router.post(
    "/api/author/{author_id}/follow",
    tags=["Follow", "Follow"],
    response_model=FollowResponse,
)
def create_follow(
    follower_id: int,
    request: FollowRequest,
    queries: FollowQueries = Depends(),
):
    author_id = request.author_id
    result = queries.follow(follower_id, author_id)
    if not result:
        raise HTTPException(status_code=500, detail="Following Request Failed")
    return {"message": result}


@router.get(
    "/api/author/{author_id}/follows",
    tags=["Follow", "Follow"],
    response_model=FollowedList,
)
def get_list(follower_id: int, queries: FollowQueries = Depends()):
    followed_authors = queries.following_list(follower_id)
    if not followed_authors:
        raise HTTPException(
            status_code=404, detail="You are not following anyone yet"
        )
    return FollowedList(follower_id=follower_id, following=followed_authors)


@router.delete(
    "/api/author/{follower_id}/unfollow/{author_id}",
    tags=["Follow", "Follow"],
    response_model=UnfollowResponse,
)
def unfollow_author(
    follower_id: int, author_id: int, queries: FollowQueries = Depends()
):
    result = queries.unfollow_author(follower_id, author_id)
    if not result:
        raise HTTPException(
            status_code=500, detail="Failed to unfollow {author_id}"
        )
    return {"message": f"You successfully unfollowed author {author_id}"}
