import "./index.css";
import { Link } from "react-router-dom";

function Genre(props) {
  return (
    <Link to={`/books/genres/${props.genre}`}>
      <div style={{ backgroundColor: props.color }} className="genre-box">
        <p>{props.genre}</p>
      </div>
    </Link>
  );
}

export default Genre;
