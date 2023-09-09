import styles from "../styles/DetailHero.module.css";
import { Link, useParams } from "react-router-dom";
import GenresTag from "../GenresTag";
import { useEffect, useState } from "react";
const DetailHero = ({ book, author, children }) => {
  const { bookId } = useParams();
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    if (bookId) fetchGenres();
  }, [bookId]);

  const fetchGenres = async () => {
    const url = `${process.env.REACT_APP_API_HOST}/api/books/${bookId}/genres`;

    const res = await fetch(url);
    const { genres } = await res.json();
    setGenres(genres);
  };
  return (
    <div className={styles.container}>
      <div className={styles.upper} />
      <div className={styles.lower} />
      <div className={styles.bookCover}>
        <img src={book.cover} alt={book.title} />
        {!book.cover && (
          <div className={styles.titlePlaceholder}>{book.title}</div>
        )}
      </div>
      <div className={styles.title}>
        <h1>{book.title}</h1>
      </div>
      <section className={styles.bookInfo}>
        <address>
          by{" "}
          <Link to={`/authors/${author.username}`}>
            {author.first_name || author.lastname
              ? `${author.first_name} ${author.last_name}`
              : author.username}
          </Link>
        </address>

        <div className={styles.bookDetailGenres}>
          {genres.map((genre) => {
            return (
              <GenresTag key={genre.name + genre.id + bookId} genre={genre} />
            );
          })}
        </div>
        <p>{book.summary}</p>
        {children}
      </section>
    </div>
  );
};

export default DetailHero;
