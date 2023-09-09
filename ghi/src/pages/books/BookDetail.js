import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Nav from "../Nav/Nav";
import styles from "./styles/BookDetail.module.css";
import DetailHero from "./components/DetailHero";
import { fetchBook, fetchAuthor, fetchChapters } from "../../actions";
import ChapterList from "./components/ChapterList";
import useToken from "../../jwt.tsx";

function BookDetail() {
  const [book, setBook] = useState({});
  const [author, setAuthor] = useState({});
  const [chapterList, setChapterList] = useState([]);
  const { bookId } = useParams();

  useEffect(() => {
    if (book) {
      (async () => {
        if (book.author_id) {
          const author = await fetchAuthor(book.author_id);
          setAuthor(author);
        }
        const chapters = await fetchChapters(book.id);
        setChapterList(chapters);
      })();
    }
  }, [book]);

  useEffect(() => {
    (async () => {
      const book = await fetchBook(bookId);
      setBook(book);
    })();
  }, [bookId]);

  if (!book || !author) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.bookDetail}>
        <Nav />
        <DetailHero book={book} author={author}>
          <ChapterList chapterList={chapterList} book={book} />
        </DetailHero>
      </div>
    </>
  );
}
export default BookDetail;
