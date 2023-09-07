import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../../Nav/Nav";
import styles from "./index.module.css";

function Genres() {
  const { genre } = useParams();

  const [genreData, setGenreData] = useState([]);

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_HOST}/books/genres/${genre}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error at fetching data");
        }
        return response.json();
      })
      .then((data) => {
        setGenreData(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, [genre]);

  return (
    <div>
      <Nav />
      <div className={styles.genres}>
        {genreData.map((eachBook) => (
          <div key={eachBook.id} className={styles.bookCardOnListBook}>
            <Link to={`/books/${eachBook.id}`}>
              <img
                src={eachBook.cover}
                alt={eachBook.title}
                className={styles.bookCoverOnListBook}
              />
            </Link>
            <h3 className="book-title">{eachBook.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Genres;
