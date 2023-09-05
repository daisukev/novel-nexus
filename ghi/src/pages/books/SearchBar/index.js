// import "./index.css";
import styles from "./index.module.css";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Nav from "../../Nav/Nav";

function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/books/search?q=${query}`
      );
      if (res.ok) {
        const { books } = await res.json();
        return books;
      } else {
        console.error(`${res.status} - ${res.statusText}`);
        return [];
      }
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      const q = searchParams.get("q");
      if (q) {
        setQuery(q);
        const books = await handleSearch(q);
        setSearchResults(books);
      }
    })();
  }, [searchParams, setQuery]);

  return (
    <div className={styles.container}>
      <Nav />
      <div className={styles.searchResults}>
        <p className={styles.resultCount}>
          {searchResults.length}{" "}
          {searchResults.length > 1 ? "results" : "result"}
        </p>
        {searchResults.length === 0 && (
          <p className={styles.noResults}>
            Your search — <strong>{query}</strong> — did not match any books.
          </p>
        )}
        <div className={styles.resultsContainer}>
          {searchResults.map((book) => {
            return (
              <SearchCard
                key={book.id + book.title + book.author_id}
                book={book}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

const SearchCard = ({ book }) => {
  return (
    <div className={styles.searchCard}>
      <Link to={`/books/${book.id}`}>
        <div className={styles.coverContainer}>
          {book.cover && <img src={book.cover} alt={book.title} />}
        </div>
      </Link>
      <div className={styles.info}>
        <h2>
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </h2>
        <address>
          by{" "}
          {book.first_name || book.last_name
            ? `${book.first_name} ${book.last_name}`
            : book.username}
        </address>
        <div className={styles.genresContainer}>
          {book.genres.map((genre) => {
            if (genre)
              return (
                <Link
                  to={`/books/genres/${genre}`}
                  key={genre + book.id}
                  className={styles.genreTag}
                >
                  {genre}
                </Link>
              );
            return null;
          })}
        </div>
        <div className={styles.summary}>
          <p>{book.summary}</p>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
