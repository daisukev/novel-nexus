import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAuthor } from "../../../actions";
import styles from "../styles/BookCard.module.css";
const BookCard = ({ book }) => {
  const [author, setAuthor] = useState({});

  useEffect(() => {
    if (book.author_id) {
      (async () => {
        try {
          const author = await fetchAuthor(book.author_id);
          setAuthor(author);
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [book]);

  return (
    <div className={styles.card}>
      <Link
        to={`/books/${book.id}`}
        className={styles.bookCover}
        style={{ backgroundImage: `url(${book.cover})` }}
      >
        {!book.cover && book.title}
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
          <a href={`/profile/view/${author.username}`}>
            {author.first_name || author.last_name
              ? `${author.first_name} ${author.last_name}`
              : author.username}
          </a>
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
