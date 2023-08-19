from pydantic import BaseModel


class FollowRequest(BaseModel):
    author_id: int


class FollowResponse(BaseModel):
    message: str


class FollowedList(BaseModel):
    follower_id: int
    following: list[FollowRequest]


class UnfollowResponse(BaseModel):
    message: str
