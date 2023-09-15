import React from "react";
import { Link } from 'react-router-dom'
import "../css/AuthorOfTheMonth.css";
import tom from "../../images/tom.jpg";
import { useAuthors } from './useAuthors';

function AuthorOfTheMonth() {
  const authorsList = useAuthors();

  const featuredUsernames = ['tomHanks'];

  const topAuthor = authorsList.find((author) =>
    featuredUsernames.includes(author.username)
  );

  // Check if topAuthor is defined before rendering
  if (!topAuthor) {
    return (
      <div className="top-author-spotlight">
        <p>No author found.</p>
      </div>
    );
  }

  return (
    <div className="top-author-spotlight">
      <div className="top-author-text">
        <h2 className="top-author-header">Author of the Month</h2>
        <p className="top-author-description">
          Tom ability to weave intricate plots, create unforgettable characters, and explore thought-provoking themes is truly exceptional.{" "}
        </p>
        <Link to={`/authors/${topAuthor.username}`}>
          <button className="author-of-the-month-btn">Visit Profile</button>
        </Link>
      </div>

      <div className="top-author-card">
        <img className="top-author-image" src={tom} alt="Top Author" />
      </div>
    </div>
  );
}

export default AuthorOfTheMonth;
