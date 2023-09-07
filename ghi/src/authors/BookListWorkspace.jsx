import { useEffect, useState } from "react";
import useToken from "../jwt.tsx";
import { Link } from "react-router-dom";
import withAuthRedirect from "../components/withAuthRedirect";
import Nav from "../pages/Nav/Nav";
import styles from "./styles/BookListWorkspace.module.css";

function BookListWorkspace() {
  const { token, fetchWithToken, tokenFetchError } = useToken();
  const [books, setBooks] = useState([]);
  const [bookTitle, setBookTitle] = useState("");

  useEffect(() => {
    if (token) {
      fetchBooks();
    }
  }, [token]);

  const addBook = async (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_HOST}/api/books`;
    const bookTitles = books?.map((book) => {
      return book.title.toLowerCase();
    });
    const lowerCaseTitle = bookTitle.toLowerCase();
    let newTitle = bookTitle;
    if (bookTitles.includes(lowerCaseTitle)) {
      // TODO: error handle this better.
      setBookTitle("");
      return;
    }
    if (!newTitle) {
      newTitle = "Untitled Book";
      const baseLine = newTitle;
      let num = 0;
      while (bookTitles.includes(newTitle.toLowerCase())) {
        num++;
        newTitle = `${baseLine} (${num})`;
      }
    }
    const newBookData = {
      title: newTitle,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const options = {
      body: JSON.stringify(newBookData),
    };

    try {
      const newBook = await fetchWithToken(url, "POST", headers, options);
    } catch (error) {
      console.error(error);
    }

    setBookTitle("");
    fetchBooks();
  };

  const fetchBooks = async () => {
    // const url = `${process.env.REACT_APP_API_HOST}/api/my/books`;
    const url =
      "https://may-12-pt-novel-nexus-api.mod3projects.com/api/my/books";
    try {
      const data = await fetchWithToken(url);
      setBooks(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className={styles.container}>
      <Nav />
      <div className={styles.bookListWorkspace}>
        <h1>Workspace</h1>
        <h2>My Books</h2>
        <form onSubmit={addBook}>
          <label htmlFor="title">Book Title:</label>
          <input
            name="title"
            placeholder="Enter Title"
            type="text"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />
          <button type="submit">Add Book</button>
        </form>
        <BookList books={books} fetchBooks={fetchBooks} />
      </div>
    </div>
  );
}

function BookList({ books, fetchBooks }) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const openDeleteModal = (book) => {
    setBookToDelete(book);
    setDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setBookToDelete(null);
    setDeleteModal(false);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "  repeat( auto-fill, minmax(300px, 1fr) )",
        gap: "1rem",
      }}
    >
      {books?.map((book) => {
        return (
          <BookCard
            key={book.id}
            book={book}
            openDeleteModal={openDeleteModal}
          />
        );
      })}
      {deleteModal && (
        <DeleteBookModal
          bookToDelete={bookToDelete}
          fetchBooks={fetchBooks}
          closeDeleteModal={closeDeleteModal}
        />
      )}
    </div>
  );
}

function BookCard({ book, openDeleteModal }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        margin: "0.5rem",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "120px",
          aspectRatio: "2/3",
          overflow: "hidden",
          position: "relative",
          background: "lightgrey",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Link
          to={`/my/workspace/books/${book.id}`}
          style={{
            textDecoration: "none",
            textAlign: "center",
            color: "#333",
            fontWeight: "bold",
            fontSize: "0.8rem",
          }}
        >
          {book.cover && !imgError ? (
            <img
              src={book.cover}
              onError={() => setImgError(true)}
              alt={book.title}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <span>{book.title}</span>
          )}
        </Link>
      </div>
      <div style={{ paddingInline: "0.25rem", overflow: "hidden" }}>
        <h3>{book.title}</h3>
        <Link to={`/my/workspace/books/${book.id}`}>Edit {book.title}</Link>
        <p>Published? {book.is_published ? "Yes" : "No"}</p>
        <button type="button" onClick={() => openDeleteModal(book)}>
          Delete
        </button>
      </div>
    </div>
  );
}

function DeleteBookModal({ closeDeleteModal, bookToDelete, fetchBooks }) {
  const { token, fetchWithToken } = useToken();
  const [canDelete, setCanDelete] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    if (deleteConfirmation === bookToDelete.title) {
      setCanDelete(true);
    } else {
      setCanDelete(false);
    }
  }, [deleteConfirmation, bookToDelete.title]);

  const deleteBook = async (e) => {
    e.preventDefault();

    if (token) {
      try {
        const url = `${process.env.REACT_APP_API_HOST}/api/books/${bookToDelete.id}`;
        const headers = {
          "Content-Type": "application/json",
        };
        const res = await fetchWithToken(url, "DELETE", headers);
        fetchBooks();
        closeDeleteModal();
      } catch (e) {
        console.error(e);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("keyup", handleKeyPress);
    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Escape") {
      closeDeleteModal();
    }
  };

  // TODO: Ideally, this and the other delete modal should be the same component.
  return (
    // rome-ignore lint: The key handler is attached to the window.
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        height: "100vh",
        width: "100vw",
        background: "rgba(0,0,0,0.8)",
        display: "grid",
        alignItems: "center",
        justifyItems: "center",
      }}
      onClick={closeDeleteModal}
    >
      {/* rome-ignore lint: The key handler is attached to the window.  */}
      <div
        style={{
          background: "var(--background)",
          width: "60ch",
          height: "20rem",
          display: "grid",
          alignItems: "center",
          justifyItems: "center",
          padding: "2rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={deleteBook}>
          <p>
            Are you sure you want to delete? This cannot be undone. To delete,
            please type the name of the book exactly as typed:
          </p>
          <p
            style={{
              background: "var(--background-darker)",
              border: "var(--accent)",
              padding: "1rem",
            }}
          >
            {bookToDelete.title}
          </p>
          <p>
            <label htmlFor="deleteConfirm" hidden>
              Confirm Deletion:
            </label>
            <input
              name="deleteConfirm"
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              style={{ padding: "1rem" }}
            />
          </p>
          <button
            type="button"
            onClick={() => closeDeleteModal()}
            style={{
              paddingBlock: "0.25rem",
              paddingInline: "0.75rem",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canDelete}
            style={{
              background: "var(--error-color)",
              color: "var(--background-lighter)",
              paddingBlock: "0.25rem",
              paddingInline: "0.75rem",
            }}
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuthRedirect(BookListWorkspace);
