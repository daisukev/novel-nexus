import useToken from "../jwt.tsx";
import { useState, useEffect } from "react";
import { useMessageContext } from "../MessageContext";
import styles from "./styles/GenresEditor.module.css";
const GenresEditor = ({ book }) => {
  const { MESSAGE_TYPES, createMessage } = useMessageContext();
  const { token, fetchWithToken } = useToken();
  const [genresList, setGenresList] = useState([]);
  const [currentGenres, setCurrentGenres] = useState([]);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    (async () => {
      const genres = await fetchGenresList();
      setGenresList(genres);
    })();
  }, []);

  useEffect(() => {
    const optionsList = genresList.filter((genre) => {
      return !currentGenres.some((currentGenre) => {
        return genre.id === currentGenre.id;
      });
    });

    setOptions(optionsList);
  }, [currentGenres, genresList]);

  useEffect(() => {
    (async () => {
      if (book.id) {
        const currentGenres = await fetchCurrentGenres();
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
  const addGenres = async (e) => {
    const genreId = e.target.value;
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const options = {
        body: JSON.stringify({ genre_id: genreId }),
      };
      const url = `${process.env.REACT_APP_API_HOST}/api/books/${book.id}/genres`;
      const res = await fetchWithToken(url, "POST", headers, options);
      const currentGenres = await fetchCurrentGenres();
      setCurrentGenres(currentGenres);
      createMessage(`Added genre.`, MESSAGE_TYPES.INFO);
    } catch (e) {
      createMessage(`Could not add genre.`, MESSAGE_TYPES.ERROR);
      console.error(e);
    }
  };
  const deleteGenre = async (genre) => {
    const url = `${process.env.REACT_APP_API_HOST}/api/books/${book.id}/genres`;
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const options = {
        body: JSON.stringify({ genre_id: genre.id }),
      };
      const res = await fetchWithToken(url, "DELETE", headers, options);
      const currentGenres = await fetchCurrentGenres();
      setCurrentGenres(currentGenres);
    } catch (e) {
      createMessage(`Could not delete: ${genre.name}`, MESSAGE_TYPES.ERROR);
    }
  };

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
    <div className={styles.genreEditor}>
      <div className={styles.selectArea}>
        <label htmlFor="genre">Add Genres</label>
        <select
          name="genre"
          id="genre-picker"
          className={styles.genrePicker}
          onChange={(e) => addGenres(e)}
        >
          <option value="">Add Genre</option>
          {options.map((genre) => {
            return (
              <option
                key={`genreList-${genre.id}-${genre.name}`}
                value={genre.id}
              >
                {genre.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className={styles.genreList}>
        {currentGenres.map((genre) => {
          return (
            <GenreCard
              key={genre.id + genre.name}
              deleteGenre={deleteGenre}
              genre={genre}
            >
              {genre.name}
            </GenreCard>
          );
        })}
      </div>
    </div>
  );
};

export default GenresEditor;

const GenreCard = ({ genre, deleteGenre, children }) => {
  return (
    <span className={styles.genreCard}>
      <span className={styles.genreName}>{children}</span>
      <button
        className={styles.deleteButton}
        type="button"
        onClick={() => deleteGenre(genre)}
      >
        <i className="ri-close-line" />
      </button>
    </span>
  );
};
