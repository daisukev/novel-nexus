import { useEffect, useState } from "react";
import useToken from "../jwt.tsx";
import { useParams, useNavigate } from "react-router-dom";
export default function DeleteChapterModal({
  closeDeleteModal,
  chapterToDelete,
  fetchChapters,
}) {
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
    } else {
      setCanDelete(false);
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
          background: "var(--background)",
          width: "50ch",
          height: "20rem",
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
          <p
            style={{
              background: "var(--background-darker)",
              padding: "1rem",
              border: "1px solid var(--accent)",
            }}
          >
            {chapterToDelete.title}
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
