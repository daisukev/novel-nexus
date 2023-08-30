import { useEffect, useState, createContext } from "react";
import useToken from "../jwt.tsx";
import { Outlet, useParams, Link, useNavigate } from "react-router-dom";

export const ChaptersContext = createContext();

export default function BookDetailWorkspace() {
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
          <DeleteModal
            closeDeleteModal={closeDeleteModal}
            chapterToDelete={chapterToDelete}
            fetchChapters={fetchChapters}
          />
        )}
      </div>
    </div>
  );
}

function BookDetailsEditor({ book }) {
  const { token, fetchWithToken } = useToken();
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    is_published: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_HOST}/api/books/${book.id}`;
    const headers = {
      "Content-Type": "application/json",
    };
    const options = {
      body: JSON.stringify(formData),
    };
    if (token) {
      try {
        const res = await fetchWithToken(url, "PUT", headers, options);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    setFormData({
      title: book.title ? book.title : "",
      summary: book.summary ? book.summary : "",
      is_published: book.is_published ? book.is_published : false,
    });
  }, [book]);

  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  return (
    <div>
      <h3>Edit Details</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title: </label>
          <input
            value={formData.title}
            onChange={handleChange}
            type="text"
            name="title"
          />
        </div>
        <div>
          <label htmlFor="summary">Summary: </label>
          <textarea
            value={formData.summary}
            onChange={handleChange}
            type="text"
            name="summary"
          />
        </div>
        <label htmlFor="is_published">Published? </label>
        <input
          name="is_published"
          checked={formData.is_published}
          onChange={handleChange}
          type="checkbox"
        />
        <div>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}

//TODO: split the unpublished chapters into its own list.
function ChaptersList({
  chapters,
  setChapters,
  bookId,
  setChapterId,
  fetchChapters,
  setChapter,
  openDeleteModal,
}) {
  const { token, fetchWithToken } = useToken();
  const [mutableChapters, setMutableChapters] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (chapters !== mutableChapters) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [chapters, mutableChapters, isChanged]);

  const handleDragStart = (index) => {
    setIsDragging(true);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedIndex(null);
  };

  const handleDragOver = (index) => (e) => {
    setIsDragging(true);
    e.preventDefault();

    if (index !== draggedIndex) {
      const updatedChapters = Array.from(mutableChapters);
      const draggedChapter = updatedChapters[draggedIndex];
      updatedChapters.splice(draggedIndex, 1);
      updatedChapters.splice(index, 0, draggedChapter);
      for (let i = 0; i < updatedChapters.length; i++) {
        updatedChapters[i].chapter_order = i + 1;
      }
      setMutableChapters(updatedChapters);
      setDraggedIndex(index);
    }
  };

  const updateChapterOrder = async (e) => {
    e.preventDefault();
    const updateList = mutableChapters.map((chapter) => {
      return { id: chapter.id, chapter_order: chapter.chapter_order };
    });

    const formData = { chapters: updateList };
    const url = `${process.env.REACT_APP_API_HOST}/api/books/${bookId}/chapters`;
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const options = {
        body: JSON.stringify(formData),
      };
      const res = await fetchWithToken(url, "PUT", headers, options);
      setChapters(mutableChapters);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setMutableChapters(chapters);
  }, [chapters]);

  const resetChapterOrder = () => {
    setMutableChapters(chapters);
  };

  return (
    <>
      {mutableChapters?.map((chapter, index) => {
        return (
          <div
            key={chapter.id + chapter.title}
            className="chapter-list-draggable"
            style={{
              width: "100%",
              padding: "0.5rem",
              background: index === draggedIndex ? "gray" : "lightgray",
              cursor: isDragging ? "grabbing" : "grab",
              display: "grid",
              gridTemplateColumns: "1fr 7fr 1fr 1fr",
              alignItems: "center",
              justifyItems: "center",
              minHeight: "2rem",
            }}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver(index)}
          >
            <div>{index + 1}</div>
            <Link to={`chapters/${chapter.id}`} style={{ justifySelf: "left" }}>
              {chapter.title}
            </Link>
            <div>
              <DeleteButton
                chapter={chapter}
                openDeleteModal={openDeleteModal}
              />
            </div>
            <div>
              <i className="ri-draggable" />
            </div>
          </div>
        );
      })}

      <form onSubmit={updateChapterOrder}>
        {isChanged && (
          <>
            <button type="submit">Update Chapter Order</button>
            <button type="button" onClick={resetChapterOrder}>
              Reset Chapter Order
            </button>
          </>
        )}
      </form>
    </>
  );
}

const DeleteButton = ({ openDeleteModal, chapter }) => {
  return (
    <>
      <button
        type="button"
        style={{
          fontSize: "1.2rem",
          border: "none",
          background: "inherit",
          color: "#AF4040",
          cursor: "pointer",
        }}
        onClick={() => {
          openDeleteModal(chapter);
        }}
      >
        <i className="ri-file-reduce-fill" />
      </button>
    </>
  );
};

function DeleteModal({ closeDeleteModal, chapterToDelete, fetchChapters }) {
  const { token, fetchWithToken } = useToken();
  const [canDelete, setCanDelete] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const deleteChapter = async (e) => {
    e.preventDefault();

    if (token) {
      try {
        const url = `${process.env.REACT_APP_API_HOST}/api/chapters/${chapterToDelete.id}`;
        const headers = {
          "Content-Type": "application/json",
        };
        await fetchWithToken(url, "DELETE", headers);
        fetchChapters();
        closeDeleteModal();
        if (chapterToDelete.id.toString() === chapterId) {
          navigate(`/my/workspace/books/${bookId}`);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (deleteConfirmation === chapterToDelete.title) {
      setCanDelete(true);
    }
  }, [deleteConfirmation, chapterToDelete.title]);

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
          background: "white",
          width: "50%",
          height: "25%",
          display: "grid",
          alignItems: "center",
          justifyItems: "center",
          padding: "2rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={deleteChapter}>
          <p>
            Are you sure you want to delete? This cannot be undone. To delete,
            please type the name of the chapter exactly as typed:
          </p>
          <p style={{ background: "#ccc" }}>{chapterToDelete.title}</p>
          <p>
            <label htmlFor="deleteConfirm" hidden>
              Confirm Deletion:
            </label>
            <input
              name="deleteConfirm"
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
          </p>
          <button type="button" onClick={() => closeDeleteModal()}>
            Cancel
          </button>
          <button type="submit" disabled={!canDelete}>
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
