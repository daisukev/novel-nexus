import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './styles/TopBooks.css'

function TopBooks() {
  const [topList, setBookList] = useState([]);
  const [error, setError] = useState(null);

  async function fetchPopularBooks() {
    try {
      const url = `${process.env.REACT_APP_API_HOST}/api/top/books`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setBookList(data.slice(0,3));
        console.log(data)
      } else {
        throw new Error("Failed to fetch top books");
      }
    } catch (error) {
      console.error(error);
      setError(error.message)
    }
  }

  useEffect(() => {
    fetchPopularBooks()
  }, []);

  if (topList.length === 0) {
    return null
  }


 // Ensure that topList is always an array

  if(error){
      return <div>Error: {error}</div>
  }

  return (
    <>

<div className="latest-releases">
        <h2 className="latest-releases-header">Top Books</h2>
        <div className="latest-releases-container">
        { topList.map((book) => (
              <div key={book.id} className="release-card">
                  <Link to={`/books/${book.id}`}>
                      <img
                        src={book.cover}
                        alt={`${book.title} image`}
                        className="release-img"
                      />
                    </Link>
                    <div className="recent-book-title">
                      <h3 >{book.title}</h3>
                      <p>By {book.author_first_name}</p>
                 </div>
            </div>
            ))}
        </div>
        <button className="view-all-btn">View All</button>
      </div>
    </>
  );
}

export default TopBooks;
