from fastapi.testclient import TestClient
from main import app
from queries.books import BookRepository, BookOut


client = TestClient(app)


class MockBookQueries:
    def get_one(self, author_id: int):
        return BookOut(
            id=1,
            title="A Book",
            author_id=3,
            summary=None,
            cover=None,
            is_published=True,
            created_at="2023-08-30T20:37:42.534783",
            updated_at="2023-08-30T20:37:42.534783",
        )


def test_get_book_by_id():
    app.dependency_overrides[BookRepository] = MockBookQueries

    client = TestClient(app)
    response = client.get("/api/books/1")

    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "title": "A Book",
        "author_id": 3,
        "summary": None,
        "cover": None,
        "is_published": True,
        "created_at": "2023-08-30T20:37:42.534783",
        "updated_at": "2023-08-30T20:37:42.534783",
    }
