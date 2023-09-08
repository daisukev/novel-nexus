import React from "react";
import "./css/main.css";
import { Link } from 'react-router-dom'
import main2 from "../images/main2.png";
import videoSrc from "../images/videoSrc.mp4";
import recent2 from '../images/recent-2.png'
import recent4 from '../images/recent-4.png'
import recent9 from '../images/recent-9.png'
import recent10 from '../images/recent-10.png'
import RecentBooks from "../books/RecentBooks";
import TopBooks from "../books/TopBooks";
import Nav from "../Nav/Nav";
import Footer from "../Nav/Footer";
import FeaturedAuthor from './authorsHook/FeaturedAuthor'
import AuthorOfTheMonth from "./authorsHook/AuthorOfTheMonth";
import RealTimeStar from "./authorsHook/RealTimeStar";

function Home({ token, user, setRecentBooks}) {

  return (
    <>
      <Nav token={token} authenticatedUser={user} />
      <div class="main-banner-container">
        <div className="main-banner-content">
          <div className="main-intro-text">
            <h1 className="main-banner-header-text">Gateway to Literary Adventures</h1>
            <p className="main-text-paragraph">
            Where Stories Come to Life. Join us in exploring new worlds, uncovering hidden tales, and sharing your own.

            </p>
            <Link to="/books">
                <button className="main-banner-btn">Explore</button>
            </Link>
          </div>
        </div>

        <div className="main-banner-visual">
          <video className="banner-video" autoPlay muted loop>
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="main-banner-second-card">
            <img className="first-img" src={main2} />
          </div>
        </div>
      </div>

      <div className="render-recent-book">
             <RecentBooks setRecentBooks={setRecentBooks} />
      </div>
      <div className="render-featured-author">
           <FeaturedAuthor />
      </div>

      <div className="render-author-of-the-month">
        <AuthorOfTheMonth/>
      </div>

      <div className="render-top-books-list">
        <TopBooks />
      </div>

      <div  className="render-rising-author">
        <RealTimeStar />
      </div>

      <div class="top-sellers-section">
        <h2 className="best-seller-header">E-books</h2>
        <div className="top-seller-container">
          <div class="best-seller-card">
            <img src={recent2} alt="Book 1 Cover" class="best-seller-img" />
            <div class="best-seller-details">
              <p class="best-seller-title">Calculus Math Made Easy</p>
              <small>By Loren Josh</small>
              <div class="book-stars">4.9⭐</div>
              <button className="best-seller-btn">Buy</button>
            </div>
          </div>

          <div class="best-seller-card">
            <img src={recent9} alt="Book 1 Cover" class="best-seller-img" />
            <div class="best-seller-details">
              <p class="best-seller-title">Death Beside the Seaside</p>
              <small>By T.E Kinsey</small>
              <div class="book-stars">4.8⭐</div>
              <button className="best-seller-btn">Buy</button>
            </div>
          </div>
          <div class="best-seller-card">
            <img src={recent4} alt="Book 1 Cover" class="best-seller-img" />
            <div class="best-seller-details">
              <p class="best-seller-title">Software Agile</p>
              <small>By Json Edison</small>
              <div class="book-stars">4.7⭐</div>
              <button className="best-seller-btn">Buy</button>
            </div>
          </div>
          <div class="best-seller-card">
            <img src={recent10} alt="Book 1 Cover" class="best-seller-img" />
            <div class="best-seller-details">
              <p class="best-seller-title">Poster Girl</p>
              <small>By Voronica Roth</small>
              <div class="book-stars"> 4.8 ⭐</div>
              <button className="best-seller-btn">Buy</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default Home;
