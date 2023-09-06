import React, { useState, useEffect } from "react";
// import "./books.css";
import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import BookCard from "./components/BookCard";
import styles from "./styles/BookList.module.css";
import { fetchAllBooks } from "../../actions";

function BookList() {
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const books = await fetchAllBooks();
        console.log("BOOOKS", books);
        setBookList(books);
      } catch (e) {
        console.error(e);
      }
    })();
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
      <div>
        <Nav />
        <div className={styles.bookList}>
          <h1 className={styles.sectionHeader}>All Books</h1>
          <div className={styles.bookListContainer}>
            {bookList.map((book) => {
              return <BookCard key={book.id + book.title} book={book} />;
            })}
          </div>
          {/* <div className="banner"> */}
          {/*   <div> */}
          {/*     <Link className="book-list-search" to="/books/search"> */}
          {/*       Search... */}
          {/*     </Link> */}
          {/*   </div> */}
          {/*   <div className="banner-content"> */}
          {/*     <h1 className="book-list-h1-header">Ultimate Books</h1> */}
          {/*     <h2>Explore knowledge</h2> */}
          {/*     <p className="book-list-banner-paragraph"> */}
          {/*       Lorem ipsum dolor sit amet, consectetur adipiscing elitmpor */}
          {/*     </p> */}
          {/*     <p className="book-list-banner-paragraph"> */}
          {/*       Consectetur adipiscing elitmpor, ipsum dolor sit amet. */}
          {/*     </p> */}
          {/*     <button className="browse-button">Browse</button> */}
          {/*   </div> */}
          {/*   <div className="book-3d-wrapper"> */}
          {/*     <div className="book-3d"></div> */}
          {/*   </div> */}
          {/* </div> */}
          {/*   {bookList && */}
          {/*     bookList.map((genre) => ( */}
          {/*       <div key={genre.id} className="genre-container"> */}
          {/*         <div className="genre-header"> */}
          {/*           <h2 className="book-list-h2-header">{genre.name}</h2> */}
          {/*           <a href={`/genre/${genre.name}`} className="browse-link"> */}
          {/*             Browse */}
          {/*           </a> */}
          {/*         </div> */}
          {/*         <div className="books-preview"> */}
          {/*           {genre.books.map((book) => ( */}
          {/*             <div key={book.id} className="book-card-on-listBook"> */}
          {/*               <Link to={`/books/${book.id}`}> */}
          {/*                 <img */}
          {/*                   src={book.cover} */}
          {/*                   alt={book.title} */}
          {/*                   className="bookCoverOnListBook" */}
          {/*                 /> */}
          {/*               </Link> */}
          {/*               <h3 className="book-title">{book.title}</h3> */}
          {/*             </div> */}
          {/*           ))} */}
          {/*         </div> */}
          {/*       </div> */}
          {/*     ))} */}
        </div>
      </div>
    </>
  );
}
export default BookList;
