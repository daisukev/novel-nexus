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
    const url = `${process.env.REACT_APP_API_HOST}/api/my/books`;
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
        <form onSubmit={addBook} className={styles.bookForm}>
          <label htmlFor="title" hidden>
            Book Title:
          </label>
          <input
            name="title"
            placeholder="Enter Title"
            type="text"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            className={styles.titleInput}
          />
          <button
            type="submit"
            className={`${styles.button} ${styles.addButton}`}
          >
            Add Book
          </button>
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
    <div className={styles.gridContainer}>
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
    <div className={styles.bookCard}>
      <Link to={`/my/workspace/books/${book.id}`} className={styles.bookImg}>
        {book.cover && !imgError ? (
          <img
            src={book.cover}
            onError={() => setImgError(true)}
            alt={book.title}
          />
        ) : (
          <span>{book.title}</span>
        )}
      </Link>
      <div className={styles.cardContent}>
        <div className={styles.titleContainer}>
          <h3 className={styles.cardH3}> {book.title}</h3>
        </div>
        <p>Book Status: {book.is_published ? "Published" : "Unpublished"}</p>
        <div className={styles.buttons}>
          <button
            type="button"
            onClick={() => openDeleteModal(book)}
            className={`${styles.deleteButton} ${styles.button}`}
          >
            Delete
          </button>
          <Link to={`/my/workspace/books/${book.id}`}>
            <button className={`${styles.editButton} ${styles.button}`}>
              Edit{" "}
            </button>
          </Link>
        </div>
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
        className={styles.modal}
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
              className={styles.deleteConfirm}
            />
          </p>
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => closeDeleteModal()}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canDelete}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuthRedirect(BookListWorkspace);
