import { useEffect, useState, createContext } from "react";
import useToken from "../jwt.tsx";
import { Outlet, useParams, Link, useNavigate } from "react-router-dom";
import BookDetailsEditor from "./BookDetailsEditor";
import ChaptersList from "./ChaptersList";
import DeleteChapterModal from "./DeleteChapterModal";
import styles from "./styles/BookDetailWorkspace.module.css";
import logo from "../transparentlogo.png";

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
      chapter_order: chapterTitles.length + 1,
    };
    const options = {
      body: JSON.stringify(formData),
    };

    const data = await fetchWithToken(url, "POST", headers, options);
    fetchChapters();
  };

  return (
    <div className={styles.bookDetailWorkspace}>
      <div className={styles.sidebar}>
        <Link to="/my/workspace" className={styles.logoHeader}>
          <img src={logo} alt="Novel Nexus Logo" />
          <h3 className={styles.header}>Novel Nexus</h3>
        </Link>
        <div className={styles.navList}>
          <Link to="/my/workspace">
            <i className="ri-arrow-left-fill" />
            <span className="linkText">Back to Workspace</span>
          </Link>
          <Link to={`/my/workspace/books/${bookId}`}>
            <i className="ri-book-2-line" />
            <span className="linkText">Edit Book Details</span>
          </Link>
          <Link to={`/books/${bookId}`}>
            <i className="ri-book-open-line" />
            <span className="linkText">View Book Page</span>
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            paddingBlock: "0.5rem",
          }}
        >
          <form onSubmit={addChapter}>
            <button type="submit" className={styles.addChapterButton}>
              Add Chapter
              <i className="ri-add-line" />
            </button>
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
        {/* <h1>{book.title}</h1> */}
        {!chapterId && <BookDetailsEditor book={book} fetchBook={fetchBook} />}
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
