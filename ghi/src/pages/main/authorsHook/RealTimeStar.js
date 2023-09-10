import React from 'react';
import { useAuthors } from './useAuthors';
import { Link } from 'react-router-dom'
import "../css/RealTimeStar.css";

function RealTimeStar() {
    const authorsList = useAuthors();

  if (authorsList === undefined) {
    return null;
  }

  const risingAuthor = ['JonathanEscoffery'];

  const getRisingAuthors = authorsList.filter((author) =>
     risingAuthor.includes(author.username)
  );


  return (
    <>
<div className="real-time-updates">
        <h2 className="updates-header">Real-time Star</h2>
        {getRisingAuthors.map((risingAuthor) => (
        <div className="rising-authors">
          <div className="rising-author-flex-box">
          <div className="author-container">
               <div className="avatar-box">
                      <img className="rising-author-avatar" src={risingAuthor.avatar} alt={`Author ${risingAuthor.username}`} />
                  </div>
            <div className="rising-author-info">
            <p className="author-name">{risingAuthor.first_name} {risingAuthor.last_name}</p>
              <span className="realtime-author-followers margin">
                Followers: 12,345
              </span>
              <span className="author-content margin">
                Likes 30K
              </span>
            </div>
            </div>
             <div>
                    <ul className="rising-star-content-list">
                    <li>Chapter 3 - Splashdow</li>
                    <li>Chapter 2 - Under the Ackee Tree</li>
                    <li>Chapter 1 - In Flux </li>
                    </ul>
              </div>
                 <Link to={`/authors/${risingAuthor.username}`}>
                      <button className="realtime-button">Visit Profile</button>
                </Link>

            </div>
            </div>

           )) }
      </div>
</>
  );
}

export default RealTimeStar;
