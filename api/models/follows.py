from pydantic import BaseModel


class FollowRequest(BaseModel):
    author_id: int


class FollowResponse(BaseModel):
    is_following: bool


class FollowedList(BaseModel):
    follower_id: int
    following: list[FollowRequest]
    is_following: bool


class UnfollowResponse(BaseModel):
    is_not_following: bool
