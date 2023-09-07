import React, { useState, useEffect } from "react";
import "./css/profile.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Nav from "../Nav/Nav";
import Follow from "./follows/Follow";
import DynamicSidebar from "./DynamicSidebar";
function Profile({ token, authenticatedUser }) {
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
        console.log(data.avatar)
        console.log(data, "author")

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

             {authenticatedUser && (
                <Follow
                  token={token}
                  authenticatedUser={authenticatedUser}
                />
              )}
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
            {authenticatedUser && (
              <div>
                < DynamicSidebar />
             </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
