import React  from 'react'
import { Link } from 'react-router-dom'
import './main.css'
import main2 from '../images/main2.png';
import top1 from '../images/top1.png';
import three from '../images/three.png';
import four from '../images/four.png';
import five from '../images/five.png';
import author1Image from '../images/author1.png';
import megazine1 from '../images/megazine1.png';
import videoSrc from '../images/videoSrc.mp4';
import Nav from '../Nav/Nav';
import Footer from '../Nav/Footer';


function  Home( { token, user } ){

return (
    <>
    <Nav  token={token} authenticatedUser={user}  />
    <div class="main-banner-container">
        <div className="main-banner-content">
            <div className="main-intro-text">
            <h1 className="main-banner-header-text">Welcome</h1>
            <p className="main-text-paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit, ad minim veniam, quis nostrud exercitation ullamco</p>
            <button className="main-banner-btn">Explore</button>
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

    <div className="main-top-books">
        <h1 className="main-top-books-header">Top Books Selection</h1>
    <div className="main-top-books-container">
        <div className="top-card">
            <img className="top-book-img" src={top1} />
            <div className="title-top">
                <h3>Title 1</h3>
            </div>
         </div>

         <div className="top-card">
            <img className="top-book-img" src={top1} />
            <div className="title-top">
                <h3>Title 1</h3>
            </div>
         </div>

         <div className="top-card">
            <img className="top-book-img" src={top1} />
            <div className="title-top">
                <h3>Title 1</h3>
            </div>
         </div>

         <div className="top-card">
            <img className="top-book-img" src={top1} />
            <div className="title-top">
                <h3>Title 1</h3>
            </div>
         </div>

         <div className="top-card">
            <img className="top-book-img" src={top1} />
            <div className="title-top">
                <h3>Title 1</h3>
            </div>
         </div>

         <div className="top-card">
            <img className="top-book-img" src={top1} />
            <div className="title-top">
                <h3>Title 1</h3>
            </div>
         </div>
        </div>
    </div>


<div className="featured-authors">
    <h2 className="featured-authors-header">Our Top Featured Authors</h2>
    <div className="featured-authors-container">
    <div className="featured-author-card">
            <Link to={`/accounts/profile/17`}>
                <img className="author-img" src={author1Image} alt="Author 1" />
            </Link>
            <h4>Author 1</h4>
            <p>"The universe is flourishing planet"</p>
        </div>

        <div className="author-card">
            <Link to={`/accounts/profile/16`}>
                <img className="author-img" src={author1Image} alt="Author 2" />
            </Link>
            <h4>Author 2</h4>
            <p>"Knowledge is the most powerful weapon".</p>
        </div>

        <div className="author-card">
            <Link to={`/accounts/profile/15`}>
                <img className="author-img" src={author1Image} alt="Author 3" />
            </Link>
            <h4>Author 3</h4>
            <p>"Mental strength comes with consistency"</p>
        </div>
    </div>
</div>


<div className="top-author-spotlight">
    <div className="top-author-text">
        <h2 className="top-author-header">Author of the Month</h2>
        <p className="top-author-description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.        </p>
        <button className="main-banner-btn">Read More</button>
    </div>

    <div className="top-author-card">
        <img className="top-author-image" src={megazine1} alt="Top Author" />
    </div>
</div>


<div className="latest-releases">
    <h2 className="latest-releases-header">Latest Releases</h2>
    <div className="latest-releases-container">
        <div className="release-card">
            <img className="release-img" src={five} alt="placeholder" />
            <h4> Mars Land</h4>
            <p>By Samuel Luwi</p>
        </div>

        <div className="release-card">
            <img className="release-img" src={four} alt="placeholder" />
            <h4> Math Genius </h4>
            <p>By Raki John </p>
        </div>

        <div className="release-card">
            <img className="release-img" src={three} alt="placeholder" />
            <h4>Fashion Queen </h4>
            <p>By Rachel Josh</p>
        </div>
    </div>
    <button className="view-all-btn">View All</button>
</div>


<div className="real-time-updates">
    <h2 className="updates-header">Real-time Star</h2>

    <div className="rising-authors">
        <div className="rising-author-flex-box">
            <img src={author1Image} alt="Author 1" className="rising-author-avatar" />
            <div className="rising-author-info">
            <p className="author-followers">Ola Bio</p>

                <span className="realtime-author-followers margin">Followers: 12,345</span>
                <span className="author-content margin">Content Published: 56</span>
            </div>
        </div>
    </div>

    <ul className="rising-star-content-list">
        <li>Chapter 10 - The Kingdom of Rome</li>
        <li>Chapter 9 - The king Role</li>
        <li>Chapter 8 - The Forbidden knot</li>
    </ul>
    <button className="realtime-button">Visit Profile</button>
</div>

<div class="top-sellers-section">
    <h2 className="best-seller-header">Top Sellers</h2>
    <div className="top-seller-container">

    <div class="best-seller-card">
        <img src={top1} alt="Book 1 Cover" class="best-seller-img" />
        <div class="best-seller-details">
            <h3 class="best-seller-title">The Story Of Helen Keler</h3>
            <small>By Daniel Samsom</small>
            <div class="book-stars">4.9⭐</div>
            <button className="best-seller-btn">Buy</button>
        </div>
    </div>

    <div class="best-seller-card">
        <img src={top1} alt="Book 1 Cover" class="best-seller-img" />
        <div class="best-seller-details">
            <h3 class="best-seller-title">Book Title 1</h3>
            <small>By Daniel Samsom</small>
            <div class="book-stars">4.8⭐</div>
            <button className="best-seller-btn">Buy</button>

        </div>
    </div>
    <div class="best-seller-card">
        <img src={top1} alt="Book 1 Cover" class="best-seller-img" />
        <div class="best-seller-details">
            <h3 class="best-seller-title">Book Title 1</h3>
            <small>By Daniel Samsom</small>
            <div class="book-stars">4.7⭐</div>
            <button className="best-seller-btn">Buy</button>

        </div>
    </div>
    <div class="best-seller-card">
        <img src={top1} alt="Book 1 Cover" class="best-seller-img" />
        <div class="best-seller-details">
            <h3 class="best-seller-title">Book Title 1</h3>
            <small>By Daniel Samsom</small>
            <div class="book-stars"> 4.8 ⭐</div>
            <button className="best-seller-btn">Buy</button>
        </div>
    </div>
</div>
</div>

<Footer />
    </>
)

}
export default Home;
