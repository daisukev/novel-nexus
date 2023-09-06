import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import dompurify from "dompurify";
import styles from "../styles/ChapterView.module.css";
import useToken from "../../jwt.tsx";
import { fetchBook } from "../../actions.js";
const ChapterView = () => {
  const { token, fetchWithToken } = useToken();
  const { chapterId, bookId } = useParams();
  const [chapter, setChapter] = useState({});
  const [book, setBook] = useState({});
  const [purifiedHTML, setPurifiedHTML] = useState("");

  useEffect(() => {
    if (chapter) {
      const purified = dompurify.sanitize(chapter.content);
      setPurifiedHTML(purified);
    }
  }, [chapter]);

  useEffect(() => {
    if (bookId) {
      (async () => {
        const book = await fetchBook(bookId);
        setBook(book);
      })();
    }
  }, [bookId]);

  useEffect(() => {
    if (chapterId) {
      fetchChapter();
    }
  }, [chapterId]);

  const fetchChapter = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/chapters/${chapterId}`
      );
      if (response.ok) {
        const data = await response.json();
        setChapter(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!chapter) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.chapterView} id="chapter-top">
      <div className={styles.sidebar}>
        <div className={styles.navContainer}>
          <Link to={`/books/${book.id}`} className={styles.bookTitle}>
            <i className="ri-arrow-left-line" />
            {book.title}
          </Link>
        </div>
      </div>
      <div className={styles.chapterContainer}>
        <h1 className={styles.chapterTitle}>{chapter.title} </h1>
        <article
          dangerouslySetInnerHTML={{ __html: purifiedHTML }}
          className={styles.chapterContent}
        />
        <a href="#chapter-top"> To the Top</a>
      </div>
    </div>
  );
};

export default ChapterView;
