import React, { useState, useEffect } from "react";
import "./css/profile.css";
import HamburgerMenu from "./HamburgerMenu";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Nav from "../Nav/Nav";

function Profile({ authenticatedUser }) {
  const [author, setAuthor] = useState(null);
  const [activeContent, setActiveContent] = useState("recent");
  const [recentChapters, setRecentChapters] = useState(null);
  const [books, setBooks] = useState([]);
  const { author_id } = useParams();

  useEffect(() => {
    async function fetchAuthor() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/api/authors/${author_id}`
        );
        const data = await response.json();
        setAuthor(data);
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    }

    fetchAuthor();
  }, [author_id]);

  async function renderRecentChapters() {
    const url = `${process.env.REACT_APP_API_HOST}/api/chapters?author_id=${author_id}`;

    try {
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setRecentChapters(data);
      } else {
        console.error("Response Not ok");
      }
    } catch (e) {
      console.error("error, while getting list chapters", e);
    }
  }

  async function renderBookList() {
    const url = `${process.env.REACT_APP_API_HOST}/api/books?author_id=${authenticatedUser.id}`;
    try {
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      } else {
        console.error("Response Not ok");
      }
    } catch (e) {
      console.error("error, while getting list books", e);
    }
  }
  useEffect(() => {
    renderRecentChapters();
    renderBookList();
  }, []);

  return (
    <div>
      <Nav />

      <div className="profile-container">
        <div className="profile-header-container">
          <div className="profile-header">
            {author && (
              <div className="profile-bio-container">
                <h1 className="profile-name">{author.username}</h1>
                <h3 className="profile-bio">
                  Name: {`${author.first_name} ${author.last_name}`}
                </h3>
                <p className="profile-bio">{`Bio: ${author.biography}`}</p>
              </div>
            )}

            <div>
              {author && (
                <img
                  src={author.avatar}
                  alt="Profile Avatar"
                  className="profile-avatar"
                />
              )}
              <button className="author-follow-btn">Follow +</button>
            </div>
          </div>
        </div>

        <div className="author-profile-content-page">
          <div className="main-content-container">
            <div className="profile-btn-container">
              <button
                className="profile-action-button"
                onClick={() => {
                  setActiveContent("recent");
                }}
              >
                Recent
              </button>
              <button
                className="profile-action-button"
                onClick={() => {
                  setActiveContent("books");
                }}
              >
                Books
              </button>
              <button className="profile-action-button">Chat</button>
              <button className="profile-action-button">Store</button>
            </div>

            <div className="content-container flex-margin">
              <div className="grid-wrapper">
                {activeContent === "recent" &&
                  recentChapters &&
                  recentChapters.chapters

                    .filter((chapter) => {
                      const associatedBook = books?.find(
                        (book) =>
                          book.id === chapter.book_id &&
                          book.author_id === authenticatedUser.id
                      );
                      return associatedBook !== undefined;
                    })

                    .sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )
                    .map((chapter) => {
                      const associatedBook = books.find(
                        (book) =>
                          book.id === chapter.book_id &&
                          book.author_id === authenticatedUser.id
                      );
                      return (
                        <div
                          key={chapter.id}
                          className="author-content-grid-card"
                        >
                          <img
                            src={
                              associatedBook
                                ? associatedBook.cover
                                : "default-image-path.jpg"
                            }
                            alt={`${chapter.title} image`}
                            className="chapter-image"
                          />
                          <div>
                            <h4 className="chapter-list-title">
                              {chapter.title}
                            </h4>
                          </div>
                        </div>
                      );
                    })}

                {activeContent === "books" &&
                  books &&
                  books
                    .filter((book) => book.author_id === authenticatedUser.id)

                    .map((book) => (
                      <div key={book.id} className="author-content-grid-card">
                        <Link to={`/books/${book.id}`}>
                          <img
                            src={book.cover}
                            alt={`${book.title} image`}
                            className="chapter-image"
                          />
                        </Link>
                        <div>
                          <h4 className="chapter-list-title">{book.title}</h4>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          <div className="dynamic-content flex-margin">
            <h3>Quick Stats</h3>
            <ul>
              <li>Books Written: 12</li>
            </ul>

            <h3>Professional Affiliations</h3>
            <ul className="professional-affiliation">
              <li>
                <img
                  src="https://www.un.org/youthenvoy/wp-content/uploads/2014/09/unicef_twitter1.png"
                  alt="XYZ Writers' Guild Logo"
                />
                UNICEF
              </li>
              <li>
                <img
                  src="https://www.filepicker.io/api/file/wAKB3DXWRyWSckw1lXCg"
                  alt="ABC Literary Society Logo"
                />
                Writing Club
              </li>
            </ul>
          </div>
          <div className="profile-sidebar flex-margin">
            <div className="navigation-links">
              <h4>Navigate</h4>
              <ul>
                <li>
                  <a href="#works">My Works</a>
                </li>
                <li>
                  <a href="#reviews">Reviews</a>
                </li>
                <li>
                  <a href="#interviews">Interviews</a>
                </li>
              </ul>
            </div>

            <div className="featured-work">
              <ul className="featured-group-list">
                <li>
                  <a href="#">
                    <i className="featured-list"></i>
                  </a>
                  blah
                </li>
                <li>
                  <a href="#">
                    <i className="featured-list"></i>
                  </a>
                  blah
                </li>
                <li>
                  <a href="#">
                    <i className="featured-list"></i>
                  </a>
                  blah
                </li>
                <li>
                  <a href="#">
                    <i className="featured-list"></i>
                  </a>
                  blah
                </li>
              </ul>
            </div>

            <div className="related-authors">
              <h4>You Might Also Like</h4>
              <ul>
                <li>
                  <Link to="/accounts/profile/17">Author 17</Link>
                </li>
                <li>
                  <Link to="/accounts/profile/19">Author 19</Link>
                </li>
              </ul>
            </div>

            <div className="testimonials">
              <h4>What Readers Say</h4>
              <blockquote>"Amazing author! I love every book!"</blockquote>
            </div>

            <div className="social-links">
              <ul className="social-icons">
                <li>
                  <a href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
