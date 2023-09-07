from fastapi.testclient import TestClient
from main import app
from queries.chapters import ChapterQueries
from models.chapters import ChapterOut

client = TestClient(app)


class MockChapterQueries:
    def get_chapter(self, chapter_id: int):
        return ChapterOut(
            id=1,
            book_id=1,
            chapter_order=1,
            title="test_book",
            content="wordswordswords",
            views=1,
            is_published=True,
            created_at="2020-02-28T00:00:00",
            updated_at="2020-02-28T00:00:00",
        )


def test_get_chapter_by_id():
    app.dependency_overrides[ChapterQueries] = MockChapterQueries

    client = TestClient(app)
    response = client.get("/api/chapters/1")

    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "book_id": 1,
        "chapter_order": 1,
        "title": "test_book",
        "content": "wordswordswords",
        "views": 1,
        "is_published": True,
        "created_at": "2020-02-28T00:00:00",
        "updated_at": "2020-02-28T00:00:00",
    }
