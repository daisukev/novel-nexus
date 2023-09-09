import React, { useState, useEffect } from "react";
// import "./books.css";
import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import BookCard from "./components/BookCard";
import styles from "./styles/BookList.module.css";
import { fetchAllBooks } from "../../actions";

function BookList() {
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const books = await fetchAllBooks();
        setBookList(books);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

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
            {bookList.map((book) => {
              return <BookCard key={book.id + book.title} book={book} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}
export default BookList;
