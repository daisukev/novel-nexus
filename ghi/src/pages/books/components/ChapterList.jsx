import { useEffect, useState, useMemo } from "react";
import styles from "../styles/ChapterList.module.css";
import { Link } from "react-router-dom";
import useToken from "../../../jwt.tsx";
const ChapterList = ({ chapterList, book }) => {
  const { token, fetchWithToken } = useToken();
  const [readHistory, setReadHistory] = useState([]);
  const fetchReadHistory = async () => {
    const url = `${process.env.REACT_APP_API_HOST}/api/my/history`;
    try {
      const { read_history } = await fetchWithToken(url);
      setReadHistory(read_history);
    } catch (e) {
      console.error(e);
    }
  };

  const chapterIdsRead = useMemo(() => {
    if (!readHistory || !chapterList) return new Set();

    return new Set(
      readHistory.map((item) => {
        return item.chapter_id;
      })
    );
  }, [readHistory, chapterList]);

  useEffect(() => {
    if (token) fetchReadHistory();
  }, [token]);
  //TODO: add sorting by attributes
  //TODO: just refactor this to be a table.
  return (
    <div className={styles.chapterList}>
      <h1>Chapter List</h1>
      {chapterList?.map((chapter) => {
        return (
          <div
            className={styles.chapterListRow}
            key={chapter.title + chapter.chapter_order}
          >
            <img
              src={book.cover}
              alt={`cover of ${book.title}`}
              className={styles.bookImage}
            />
            <span>{chapter.chapter_order}.</span>
            <Link
              to={`/books/${book.id}/chapters/${chapter.id}`}
              className={styles.chapterTitle}
            >
              {chapter.title}
            </Link>
            <span className={styles.date}>
              {new Date(chapter.created_at).toLocaleDateString()}
            </span>
            <Link
              to={`/books/${book.id}/chapters/${chapter.id}`}
              className={styles.readNowButton}
            >
              Read Now
            </Link>
            <span>
              {chapterIdsRead.has(chapter.id) && (
                <i className="ri-check-line" />
              )}
            </span>
          </div>
        );
      })}
      {chapterList?.length === 0 && <p>No Chapters.</p>}
    </div>
  );
};
export default ChapterList;
