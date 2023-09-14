import React, { useState, useEffect, useRef } from "react";
import Nav from "../Nav/Nav";
import BookCard from "./components/BookCard";
import styles from "./styles/BookList.module.css";
import { fetchSomeBooks } from "../../actions";

function BookList() {
  const [bookList, setBookList] = useState([]);
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);
  const lastCardRef = useRef(null);
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: "0.8",
  };

  useEffect(() => {
    (async () => {
      try {
        const books = await fetchSomeBooks(limit, 0);
        setBookList(books);
        setOffset(books.length);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const LoadingSpinner = () => (
    <div className={styles.spinnerContainer}>
      <div className={styles.ldsDefault}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );

  const isObserved = async (entries) => {
    if (entries[0].isIntersecting && hasMoreBooks && !isLoading) {
      setIsLoading(true);
      const newBooks = await fetchSomeBooks(limit, offset);
      if (newBooks.length < limit) {
        setHasMoreBooks(false);
      }

      setBookList((books) => [...books, ...newBooks]);
      setIsLoading(false);
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(isObserved, options);
    if (lastCardRef.current) {
      observer.observe(lastCardRef.current);
    }
    return () => {
      if (lastCardRef.current) {
        observer.disconnect();
      }
    };
  }, [lastCardRef, options]);

  function categorizeByGenre(booksWithGenres) {
    let genres = {};

    booksWithGenres.forEach((book) => {
      if (genres[book.genre]) {
        genres[book.genre].push(book);
      } else {
        genres[book.genre] = [book];
      }
    });
    return Object.keys(genres).map((genreName) => ({
      name: genreName,
      books: genres[genreName],
    }));
  }
  if (bookList === undefined) {
    return null;
  }

  return (
    <>
      <div>
        <Nav />
        <div className={styles.bookList}>
          <h1 className={styles.sectionHeader}>All Books</h1>
          <div className={styles.bookListContainer}>
            {bookList.map((book, index) => {
              if (index === bookList.length - 1) {
                return (
                  <BookCard
                    key={book.id + book.title}
                    book={book}
                    ref={lastCardRef}
                  />
                );
              } else {
                return <BookCard key={book.id + book.title} book={book} />;
              }
            })}
            {isLoading && <LoadingSpinner />}
          </div>
        </div>
      </div>
    </>
  );
}
export default BookList;
