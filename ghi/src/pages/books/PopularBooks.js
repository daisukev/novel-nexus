import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/TopBooks.css";

function PopularBooks() {
  const [topList, setBookList] = useState([]);


  async function fetchPopularBooks() {
    try {
      const url = `${process.env.REACT_APP_API_HOST}/api/popular/books`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setBookList(data.popular.slice(0,3))

      } else {
        throw new Error("Failed to fetch popular books");
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchPopularBooks();
  }, []);


  if (topList === undefined || topList.length === 0) {
    return <div>Loading or no data available.</div>;
  }

  if (topList === undefined) {
    return;
  }

  return (
    <>
      <div className="latest-releases">
        <h2 className="latest-releases-header">Top Books</h2>
        <div className="latest-releases-container">
          {topList.map((book) => (
            <div key={book.id} className="release-card">
              <Link to={`/books/${book.book_id}`}>
                <img
                  src={book.cover}
                  alt={`${book.title} image`}
                  className="release-img"
                />
              </Link>
            </div>
          ))}
        </div>
        <button className="view-all-btn">View All</button>
      </div>
    </>
  );
}

export default PopularBooks;
