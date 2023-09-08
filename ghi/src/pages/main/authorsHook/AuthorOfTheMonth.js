import React from "react";
import "../css/AuthorOfTheMonth.css";
import tom from "../../images/tom.jpg";


function AuthorOfTheMonth() {

  return (
    <>
      <div className="top-author-spotlight">
        <div className="top-author-text">
          <h2 className="top-author-header">Author of the Month</h2>
          <p className="top-author-description">
          Their ability to weave intricate plots, create unforgettable characters, and explore thought-provoking themes is truly exceptional.{" "}
          </p>
          <button className="author-of-the-month-btn">Read More</button>
        </div>

        <div className="top-author-card">
          <img className="top-author-image" src={tom} alt="Top Author" />
        </div>
      </div>
    </>
  );
}
export default AuthorOfTheMonth;
