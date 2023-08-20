from fastapi import APIRouter, Depends
from models.genres import GenreListOut
from queries.genres import GenresQueries

router = APIRouter()


@router.get("/api/genres", tags=["Genres"], response_model=GenreListOut)
def get_genres(queries: GenresQueries = Depends()):
    return {"genres": queries.get_all_genres()}
