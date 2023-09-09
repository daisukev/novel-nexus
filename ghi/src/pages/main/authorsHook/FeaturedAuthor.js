import React from 'react';
import { useAuthors } from './useAuthors';
import { Link } from 'react-router-dom'
import "../css/FeaturedAuthors.css";

function FeaturedAuthor() {
    const authorsList = useAuthors();

  if (authorsList === undefined) {
    return null;
  }

  const featuredUsernames = ['james-clear', 'neil-gaiman', 'colleen-hoover'];

  const featuredAuthors = authorsList.filter((author) =>
    featuredUsernames.includes(author.username)
  );

  

  return (
    <div className="featured-authors">
      <h2 className="featured-authors-header">Our Top Featured Authors</h2>
      <div className="featured-authors-container">
        {featuredAuthors.map((featuredAuthor) => (
          <div className="featured-author-card" key={featuredAuthor.id}>
            <Link to={`/authors/${featuredAuthor.username}`}>
            <div>
              <img className="author-img" src={featuredAuthor.avatar} alt={`Author ${featuredAuthor.username}`} />
              </div>

              <div className="author-details">
                <h4 className="author-name">{featuredAuthor.first_name} {featuredAuthor.last_name}</h4>
                <p className="author-bio">{featuredAuthor.biography || 'No biography available'}</p>
                <div className="social-icons">
                  <a href={featuredAuthor.twitter_link} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href={featuredAuthor.facebook_link} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href={featuredAuthor.instagram_link} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>

            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedAuthor;
