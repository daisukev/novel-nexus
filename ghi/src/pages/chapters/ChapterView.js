import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import dompurify from "dompurify";
import styles from "../styles/ChapterView.module.css";
import useToken from "../../jwt.tsx";
import { fetchBook, fetchChapters } from "../../actions.js";
const ChapterView = () => {
  const { token, fetchWithToken } = useToken();
  const { chapterId, bookId } = useParams();
  const [chapter, setChapter] = useState({});
  const [chapters, setChapters] = useState([]);
  const [book, setBook] = useState({});
  const [purifiedHTML, setPurifiedHTML] = useState("");
  const [prevChapter, setPrevChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);
  const [triedReadHistory, setTriedReadHistory] = useState(false);

  const addReadHistory = async () => {
    if (token) {
      const url = `${process.env.REACT_APP_API_HOST}/api/books/${book.id}/chapters/${chapter.id}/history`;
      try {
        const res = await fetchWithToken(url, "POST");
      } catch (e) {
        if (e.message === "Conflict") {
        } else {
          console.error(e);
        }
      }
    }
  };

  useEffect(() => {
    if (token && book.id && chapter.id && !triedReadHistory) {
      const readTimer = setTimeout(() => {
        addReadHistory();
        setTriedReadHistory(true);
      }, 60000);
      return () => clearTimeout(readTimer);
    }
  }, [token, book.id, chapter.id, triedReadHistory]);

  useEffect(() => {
    setPrevChapter(null);
    setNextChapter(null);
    const currentChapter = chapter.chapter_order;
    for (let i = 0; i < chapters.length; i++) {
      if (chapters[i].chapter_order > currentChapter) {
        setNextChapter(chapters[i].id);
        break;
      }
    }
    const previousChapters = chapters.filter(
      (chapter) => chapter.chapter_order < currentChapter
    );
    if (previousChapters.length > 0) setPrevChapter(previousChapters.at(-1).id);
  }, [chapters, chapter]);

  useEffect(() => {
    if (book.id) {
      (async () => {
        const chapters = await fetchChapters(book.id);
        setChapters(chapters);
      })();
    }
  }, [book.id]);

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
        <a href="#chapter-top">
          To the Top <i className="ri-arrow-up-line" />
        </a>
        <div className={styles.chapterNavigation}>
          {prevChapter && (
            <Link to={`/books/${bookId}/chapters/${prevChapter}`}>
              <i className="ri-arrow-left-line" />
              Previous Chapter
            </Link>
          )}
          {nextChapter && (
            <Link
              to={`/books/${bookId}/chapters/${nextChapter}`}
              onClick={addReadHistory}
            >
              Next Chapter
              <i className="ri-arrow-right-line" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterView;
