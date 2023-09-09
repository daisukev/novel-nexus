import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
import useToken from "../jwt.tsx";
import DeleteButton from "./DeleteButton";

import styles from "./styles/ChaptersList.module.css";

//TODO: split the unpublished chapters into its own list.
export default function ChaptersList({
  chapters,
  setChapters,
  bookId,
  openDeleteModal,
}) {
  const { fetchWithToken } = useToken();
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
    <div className={styles.chaptersList}>
      {mutableChapters?.map((chapter, index) => {
        return (
          <div
            key={`${chapter.id}_${chapter.title}`}
            className={`${styles.chapterListDraggable}  ${
              index === draggedIndex ? styles.darken : ""
            }`}
            style={{
              background: index === draggedIndex && "",
              alignItems: "center",
              justifyItems: "center",
              minHeight: "2rem",
            }}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver(index)}
          >
            <Link to={`chapters/${chapter.id}`} className={styles.chapterTitle}>
              <strong>{index + 1}.</strong> {chapter.title}
            </Link>
            <div>
              <DeleteButton
                chapter={chapter}
                openDeleteModal={openDeleteModal}
              />
            </div>
            <div className={styles.draggableIcon}>
              <i className="ri-draggable" />
            </div>
          </div>
        );
      })}

      <form onSubmit={updateChapterOrder}>
        {isChanged && (
          <div className={styles.buttons}>
            <button type="submit" className={styles.updateButton}>
              <i className="ri-checkbox-circle-fill" />
            </button>
            <button
              type="button"
              onClick={resetChapterOrder}
              className={styles.resetButton}
            >
              <i className="ri-close-circle-fill" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
