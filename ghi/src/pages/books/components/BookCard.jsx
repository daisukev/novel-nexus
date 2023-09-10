import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAuthor } from "../../../actions";
import styles from "../styles/BookCard.module.css";
const BookCard = ({ book }) => {
  return (
    <div className={styles.card}>
      <Link
        to={`/books/${book.id}`}
        className={styles.bookCover}
        // style={{ backgroundImage: `url(${book.cover})` }}
      >
        {!book.cover && book.title}
        {book.cover !== null ? (
          <img src={book.cover} alt={book.title} loading="lazy" />
        ) : (
          ""
        )}
      </Link>
      <div className={styles.container}></div>
      <div className={styles.content}>
        <h2>
          <Link to={`/books/${book.id}`} className={styles.titleLink}>
            {book.title}
          </Link>
        </h2>
        <address className={styles.author}>
          By{" "}
          <Link to={`/authors/${book.author_username}`}>
            {book.author_first_name || book.author_last_name
              ? (book.author_first_name !== null
                  ? book.author_first_name
                  : "") +
                (book.author_last_name !== null
                  ? " " + book.author_last_name
                  : "")
              : book.author_username}
          </Link>
        </address>
        <div className={styles.descriptionContainer}>
          <p className={styles.description}>{book.summary}</p>
        </div>
        <div className={styles.buttons}>
          <Link to={`/books/${book.id}`}>Read Now</Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
