import React from 'react';
import { useAuthors } from './useAuthors';
import { Link } from 'react-router-dom'
import "../css/RealTimeStar.css";

function RealTimeStar() {
    const authorsList = useAuthors();

  if (authorsList === undefined) {
    return null;
  }

  const risingAuthor = ['robert-kiyosaki'];

  const getRisingAuthors = authorsList.filter((author) =>
     risingAuthor.includes(author.username)
  );

  if (!getRisingAuthors || getRisingAuthors.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
<div className="real-time-updates">
        <h2 className="updates-header">Real-time Star</h2>
        <div className="rising-authors">
        {getRisingAuthors.map((risingAuthor) => (
          <div className="rising-author-flex-box">
            <div >
                <div>
                      <img className="rising-author-avatar" src={risingAuthor.avatar} alt={`Author ${risingAuthor.username}`} />
                      <p className="author-name">{risingAuthor.first_name} {risingAuthor.last_name}</p>
              </div>

            <div className="rising-author-info">

              <span className="realtime-author-followers margin">
                Followers: 12,345
              </span>
              <span className="author-content margin">
                Content Published: 56
              </span>
            </div>
             <div>
                    <ul className="rising-star-content-list">
                    <li>Chapter 10 - Building Investment </li>
                    <li>Chapter 9 - The tic tac toe</li>
                    <li>Chapter 8 - Stock Learning Process</li>
                    </ul>
            </div>
                 <Link to={`/authors/${risingAuthor.username}`}>
                      <button className="realtime-button">Visit Profile</button>
                </Link>
            </div>
            </div>

           )) }
        </div>
      </div>
</>
  );
}

export default RealTimeStar;