import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../main/main.css'

function RecentBooks() {
  const [bookList, setBookList] = useState([]);

  async function fetchRecentBooks() {
    try {
      const url = `${process.env.REACT_APP_API_HOST}/api/books`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Failed to fetch recent books");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const recentBooks = await fetchRecentBooks();
        setBookList(recentBooks);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (!bookList) {
    return null;
  }


  const recentBooksLimit = bookList.slice(0, 6)
  return (
    <>
      <div className="main-recent-books">
        <h1 className="main-recent-books-header">Recent Books</h1>
        <div className="main-recent-books-container">
            {recentBooksLimit.map((book) => (
              <div key={book.id}>
                  <Link to={`/books/${book.id}`}>
                      <img
                        src={book.cover}
                        alt={`${book.title} image`}
                        className="recent-book-img"
                      />
                    </Link>
                    <div className="title-top">
                      <h3 className="recent-book-title">{book.title}</h3>
                    </div>

            </div>
            ))}

      </div>
      </div>

    </>
  );
}

export default RecentBooks;
