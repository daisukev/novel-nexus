import React, { useState, useEffect } from "react";
import "./books.css";
import { Link } from "react-router-dom";

function BookList() {
  const [bookList, setBookList] = useState([]);

  async function handleBookList() {
    const url = "http://localhost:8000/api/books";

    try {
      let response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const genresPromises = data.map(async (book) => {
          const genreResponse = await fetch(
            `http://localhost:8000/api/books/${book.id}/genres`
          );
          if (genreResponse.ok) {
            const genreData = await genreResponse.json();
            if (genreData.genres && genreData.genres[0]) {
              book.genre = genreData.genres[0].name;
            } else {
              book.genre = "All Books";
            }
            return book;
          } else {
            console.error("Book not associated with genre:", book.id);
          }
        });

        const booksWithGenres = await Promise.all(genresPromises);
        const categorizedData = categorizeByGenre(booksWithGenres);
        console.log("collection books by genre:", categorizedData);
        setBookList(categorizedData);
      } else {
        console.log("Not fetching");
      }
    } catch (e) {
      console.error("catching error while fetching book list", e);
    }
  }

  useEffect(() => {
    handleBookList();
  }, []);

  function categorizeByGenre(booksWithGenres) {
    let genres = {};

    booksWithGenres.forEach((book) => {
      if (genres[book.genre]) {
        genres[book.genre].push(book);
      } else {
        genres[book.genre] = [book];
      }
    });
    return Object.keys(genres).map((genreName) => ({
      name: genreName,
      books: genres[genreName],
    }));
  }
  if (bookList === undefined) {
    return null;
  }

  return (
    <>
      <div className="book-list-page">
        <div className="banner">
          <div className="banner-content">
            <h1 className="book-list-h1-header">Ultimate Books</h1>
            <h2>Explore knowledge</h2>
            <p className="book-list-banner-paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elitmpor
            </p>
            <p className="book-list-banner-paragraph">
              Consectetur adipiscing elitmpor, ipsum dolor sit amet.
            </p>
            <button className="browse-button">Browse</button>
          </div>
          <div className="book-3d-wrapper">
            <div className="book-3d"></div>
          </div>
        </div>
        {bookList &&
          bookList.map((genre) => (
            <div key={genre.id} className="genre-container">
              <div className="genre-header">
                <h2 className="book-list-h2-header">{genre.name}</h2>
                <a href={`/genre/${genre.name}`} className="browse-link">
                  Browse
                </a>
              </div>
              <div className="books-preview">
                {genre.books.map((book) => (
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
                ))}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
export default BookList;
