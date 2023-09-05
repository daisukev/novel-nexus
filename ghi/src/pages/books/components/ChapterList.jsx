import styles from "../styles/ChapterList.module.css";
import { Link } from "react-router-dom";
const ChapterList = ({ chapterList, book }) => {
  //TODO: add sorting by attributes
  const sorted = (chapterList) => {};
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
              height="50px"
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
            <span>{new Date(chapter.created_at).toLocaleDateString()}</span>
            <Link
              to={`/books/${book.id}/chapters/${chapter.id}`}
              className={styles.readNowButton}
            >
              Read Now
            </Link>
          </div>
        );
      })}
      {chapterList?.length === 0 && <p>No Chapters.</p>}
    </div>
  );
};
export default ChapterList;
