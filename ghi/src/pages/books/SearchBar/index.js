import "./index.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [resultPrompt, setSearchPrompt] = useState("Enter a keyword");

  const handleSearch = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8000/api/books/search/${query}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Error fetching data");
          return [];
        }
      })
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setSearchPrompt("Enter a keyword");
  }, [query]);

  useEffect(() => {
    if (searchResults.length === 0) {
      setSearchPrompt("No Match");
    } else {
      setSearchPrompt("");
    }
  }, [searchResults]);

  return (
    <div className="search">
      <div className="back">
        <Link to="/books">Back</Link>
      </div>
      <form onSubmit={handleSearch}>
        <input
          className="search-input"
          type="text"
          placeholder="Search books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div>
        <div className="books-preview">
          {searchResults[0] ? (
            searchResults.map((book) => (
              <div key={book.id} className="book-card-on-listBook">
                <Link to={`/books/${book.id}`}>
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="bookCoverOnListBook"
                  />
                </Link>
                <h3 className="book-title">{book.title}</h3>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
      <p className="book-search-prompt">{resultPrompt}</p>
    </div>
  );
}

export default SearchBar;
