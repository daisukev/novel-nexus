import styles from "./AuthorCard.module.css";
import { Link } from "react-router-dom";
const AuthorCard = ({ author }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imgContainer}>
        {author.avatar && <img src={author.avatar} loading="lazy" />}
      </div>
      <div className={styles.cardContent}>
        <h2 className={styles.cardH2}>
          {author.first_name || author.last_name
            ? (author.first_name !== null ? author.first_name : "") +
              (author.last_name !== null ? " " + author.last_name : "")
            : author.username}
        </h2>
        <p>{author.biography || "No biography provided yet!"}</p>
        <div className={styles.buttons}>
          <Link to={`/authors/${author.username}`}>View Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;
