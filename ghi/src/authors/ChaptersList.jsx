import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
import useToken from "../jwt.tsx";
import DeleteButton from "./DeleteButton";
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
