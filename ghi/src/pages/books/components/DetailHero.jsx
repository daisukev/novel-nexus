import styles from "../styles/DetailHero.module.css";
import { Link } from "react-router-dom";
const DetailHero = ({ book, author, children }) => {
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
          <Link to={`/profile/view/${author.username}`}>
            {author.first_name || author.lastname
              ? `${author.first_name} ${author.last_name}`
              : author.username}
          </Link>
        </address>
        <p>{book.summary}</p>
        {children}
      </section>
    </div>
  );
};

export default DetailHero;
