import styles from "./index.module.css";
import { Link } from "react-router-dom";

function GenresTag(props) {
  return (
    <Link
      to={{
        pathname: `/books/genres/${props.genre.name}`,
      }}
      className={styles.genre}
    >
      <div>{props.genre.name}</div>
    </Link>
  );
}

export default GenresTag;
