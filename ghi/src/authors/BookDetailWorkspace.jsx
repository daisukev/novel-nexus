import { useEffect, useState, createContext } from "react";
import useToken from "../jwt.tsx";
import { Outlet, useParams, Link, useNavigate } from "react-router-dom";
import BookDetailsEditor from "./BookDetailsEditor";
import ChaptersList from "./ChaptersList";
import DeleteChapterModal from "./DeleteChapterModal";

export const ChaptersContext = createContext();

function BookDetailWorkspace() {
  const { bookId, chapterId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [book, setBook] = useState({});
  const [chapter, setChapter] = useState({});
  const { token, fetchWithToken } = useToken();
  const [deleteModal, setDeleteModal] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState(null);

  const openDeleteModal = (chapter) => {
    setChapterToDelete(chapter);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setChapterToDelete(null);
    setDeleteModal(false);
  };

  useEffect(() => {
    if (bookId) fetchBook(bookId);
  }, [bookId]);

  useEffect(() => {
    if (token) {
      fetchChapters();
    }
  }, [token]);

  const fetchBook = async (bookId) => {
    const url = `${process.env.REACT_APP_API_HOST}/api/books/${bookId}`;
    try {
      const res = await fetch(url);
      const book = await res.json();
      setBook(book);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchChapters = async () => {
    const url = `${process.env.REACT_APP_API_HOST}/api/authors/books/${bookId}/chapters`;
    try {
      const { chapters } = await fetchWithToken(url);
      setChapters(chapters);
    } catch (e) {
      console.error(e);
    }
  };

  const addChapter = async (e) => {
    e.preventDefault();

    const chapterTitles = chapters.map((chapter) => {
      return chapter.title;
    });

    let newTitle = "Untitled Chapter";
    const baseLineTitle = newTitle;
    let num = 0;
    while (chapterTitles.includes(newTitle)) {
      num++;
      newTitle = `${baseLineTitle} (${num})`;
    }
    const url = `${process.env.REACT_APP_API_HOST}/api/books/${bookId}/chapters`;
    const headers = {
      "Content-Type": "application/json",
    };
    const formData = {
      book_id: bookId,
      title: newTitle,
      content: "",
      chapter_order: 0,
    };
    const options = {
      body: JSON.stringify(formData),
    };

    const data = await fetchWithToken(url, "POST", headers, options);
    fetchChapters();
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "max(300px) 9fr",
        gap: "0.5rem",
        height: "100vh",
        overflowY: "hidden",
      }}
    >
      <div
        style={{
          height: "max(100vh, 100%)",
          background: "lightgray",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarGutter: "stable",
        }}
      >
        <h3>Novel Nexus</h3>
        <Link to="/my/workspace">Back to Workspace</Link>
        <Link to={`/my/workspace/books/${bookId}`}>Edit Book</Link>
        <div>
          <form onSubmit={addChapter}>
            <button type="submit">Add Chapter</button>
          </form>
        </div>
        <ChaptersList
          chapters={chapters}
          setChapters={setChapters}
          setChapter={setChapter}
          bookId={bookId}
          fetchChapters={fetchChapters}
          openDeleteModal={openDeleteModal}
        />
      </div>
      <div
        className="editor-view"
        style={{
          overflowY: "auto",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* TODO: book editor component: adjust when chapter is open vs. not */}
        <h1>{book.title}</h1>
        {!chapterId && <BookDetailsEditor book={book} />}
        <ChaptersContext.Provider value={{ fetchChapters }}>
          <Outlet />
        </ChaptersContext.Provider>
        {deleteModal && (
          <DeleteChapterModal
            closeDeleteModal={closeDeleteModal}
            chapterToDelete={chapterToDelete}
            fetchChapters={fetchChapters}
          />
        )}
      </div>
    </div>
  );
}

export default BookDetailWorkspace;
