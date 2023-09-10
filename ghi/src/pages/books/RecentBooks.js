import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './styles/RecentBooks.css'

function RecentBooks() {
  const [bookList, setBookList] = useState([]);

  async function fetchRecentBooks() {
    try {
      const url = `${process.env.REACT_APP_API_HOST}/api/recent/books`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
           setBookList(data);
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
    fetchRecentBooks()
  }, []);

  if (bookList === undefined) {
    return;
  }


const booksLimit = bookList.length > 0 ? bookList.slice(0, 6) : [];
const recentBooks = booksLimit.filter((book) => book.cover).slice(0,6)

return (
    <>
      <div className="main-recent-books">
        <h1 className="main-recent-books-header">Recent Books</h1>
        <div className="main-recent-books-container">
            {recentBooks.map((book) => (
              <div key={book.id} className="recent-img-card">
                  <Link to={`/books/${book.id}`}>
                      <img
                        src={book.cover}
                        alt={`${book.title} image`}
                        className="recent-book-img"
                      />
                    </Link>
               </div>
            ))}
      </div>
    </div>
  </>
  );
}

export default RecentBooks;
