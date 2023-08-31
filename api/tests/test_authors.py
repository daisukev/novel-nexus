from fastapi.testclient import TestClient
from main import app
from queries.authors import AuthorQueries
from models.authors import AuthorOut

client = TestClient(app)


class MockAuthorQueries:
    def get_author_by_id(self, author_id: int):
        return AuthorOut(
            id=1,
            first_name="William",
            last_name="Shakespeare",
            biography="He is one of the most famous writers of all time",
            avatar="http://www.test.com/test.png",
            created_at="2020-02-28T00:00:00",
            username="william.shakespeare",
        )

    def get_author_by_username(self, username: str):
        return AuthorOut(
            id=1,
            first_name="William",
            last_name="Shakespeare",
            biography="He is one of the most famous writers of all time",
            avatar="http://www.test.com/test.png",
            created_at="2020-02-28T00:00:00",
            username="william.shakespeare",
        )


def test_get_author_by_id():
    app.dependency_overrides[AuthorQueries] = MockAuthorQueries

    client = TestClient(app)
    response = client.get("/api/authors/1")

    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "first_name": "William",
        "last_name": "Shakespeare",
        "biography": "He is one of the most famous writers of all time",
        "avatar": "http://www.test.com/test.png",
        "created_at": "2020-02-28T00:00:00",
        "username": "william.shakespeare",
    }


def test_get_author_by_username():
    client = TestClient(app)
    response = client.get("/api/authors/william.shakespeare")

    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "first_name": "William",
        "last_name": "Shakespeare",
        "biography": "He is one of the most famous writers of all time",
        "avatar": "http://www.test.com/test.png",
        "created_at": "2020-02-28T00:00:00",
        "username": "william.shakespeare",
    }
