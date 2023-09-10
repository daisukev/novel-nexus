from fastapi.testclient import TestClient
from models.genres import Genre
from main import app
from queries.genres_books import GenresBooksQueries

client = TestClient(app)


class TestGenresBooks:
    def get_book_genres(self, book_id: int):
        return [Genre(id=1, name="Fiction")]


def test_get_book_genres():
    app.dependency_overrides[GenresBooksQueries] = TestGenresBooks

    client = TestClient(app)
    response = client.get("/api/books/1/genres")

    assert response.status_code == 200
    assert response.json() == {"genres": [{"id": 1, "name": "Fiction"}]}
