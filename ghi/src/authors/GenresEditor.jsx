import useToken from "../jwt.tsx";
import { useState, useEffect } from "react";
import { useMessageContext } from "../MessageContext";
import styles from "./styles/GenresEditor.module.css";
const GenresEditor = ({ book }) => {
  const { token, fetchWithToken } = useToken();
  const [genresList, setGenresList] = useState([]);
  const [currentGenres, setCurrentGenres] = useState([]);
  useEffect(() => {
    (async () => {
      const genres = await fetchGenresList();
      setGenresList(genres);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (book.id) {
        const currentGenres = await fetchCurrentGenres();
        console.log(currentGenres);
        setCurrentGenres(currentGenres);
      }
    })();
  }, [book.id]);

  const fetchCurrentGenres = async () => {
    if (book.id) {
      try {
        const url = `${process.env.REACT_APP_API_HOST}/api/books/${book.id}/genres`;
        const res = await fetch(url);
        const { genres } = await res.json();
        return genres;
      } catch (e) {
        console.error(e);
      }
    }
  };
  const addGenres = async () => {};
  const deleteGenre = async () => {};

  useEffect(() => {
    if (token) {
    }
  }, [token]);
  const fetchGenresList = async () => {
    try {
      const url = `${process.env.REACT_APP_API_HOST}/api/genres`;
      const res = await fetch(url);
      const { genres } = await res.json();
      return genres;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      Genres:
      <div className={styles.genreList}>
        {currentGenres.map((genre) => {
          return (
            <GenreCard key={genre.id + genre.name} deleteGenre={deleteGenre}>
              {genre.name}
            </GenreCard>
          );
        })}
      </div>
    </div>
  );
};

export default GenresEditor;

const GenreCard = (props) => {
  return (
    <span {...props} className={styles.genreCard}>
      <span className={styles.genreName}>{props.children}</span>
      <button className={styles.deleteButton} type="button">
        <i className="ri-close-line" />
      </button>
    </span>
  );
};
