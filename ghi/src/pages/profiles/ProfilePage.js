import React, { useState, useEffect, useContext, useCallback } from "react";
// import "./css/profile.css";
import { NavLink, Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import Nav from "../Nav/Nav";
// import Follow from "./follows/Follow";
// import DynamicSidebar from "./DynamicSidebar";
import styles from "./css/ProfilePage.module.css";
import useToken from "../../jwt.tsx";
import { UserContext } from "../../App";
import { useMessageContext } from "../../MessageContext";
import { createContext } from "react";

export const ProfileAuthorContext = createContext();

function Profile({ authenticatedUser }) {
  const { createMessage, MESSAGE_TYPES } = useMessageContext();
  const { token, fetchWithToken } = useToken();
  const { user } = useContext(UserContext);
  const [author, setAuthor] = useState(null);
  const [recentChapters, setRecentChapters] = useState(null);
  const [books, setBooks] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const { author_id } = useParams();

  const fetchIsFollowing = useCallback(
    async (authorId) => {
      try {
        const url = `${process.env.REACT_APP_API_HOST}/api/authors/${authorId}/is-following`;
        const following = await fetchWithToken(url);
        return following;
      } catch (e) {
        console.error(e);
      }
    },
    [fetchWithToken]
  );

  const addFollow = async () => {
    try {
      const url = `${process.env.REACT_APP_API_HOST}/api/follows`;
      const res = await fetchWithToken(
        url,
        "POST",
        { "Content-Type": "application/json" },
        { body: JSON.stringify({ author_id: author.id }) }
      );
      createMessage(`Following ${author.username}`, MESSAGE_TYPES.INFO);
      const following = await fetchIsFollowing(author.id);
      setIsFollowing(following);
    } catch (e) {
      createMessage(
        `Could not follow ${author.username}`,
        MESSAGE_TYPES.ERROR,
        10000
      );
      console.error(e);
    }
  };

  const removeFollow = async () => {
    try {
      const url = `${process.env.REACT_APP_API_HOST}/api/follows`;
      const res = await fetchWithToken(
        url,
        "DELETE",
        { "Content-Type": "application/json" },
        { body: JSON.stringify({ author_id: author.id }) }
      );
      createMessage(`Unfollowing ${author.username}`, MESSAGE_TYPES.INFO);
      const following = await fetchIsFollowing(author.id);
      setIsFollowing(following);
    } catch (e) {
      console.error(e);
      createMessage(`Could not unfollow.`, MESSAGE_TYPES.ERROR);
    }
  };

  const toggleFollow = () => {
    if (isFollowing) {
      removeFollow();
    } else {
      addFollow();
    }
  };

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

  useEffect(() => {
    if (token && author && user) {
      (async () => {
        const following = await fetchIsFollowing(author.id);
        setIsFollowing(following);
      })();
    }
  }, [token, author, user, fetchIsFollowing]);

  return (
    <div className={styles.container}>
      <Nav />
      <div className={styles.profilePage}>
        <div className={styles.header}>
          <h1>
            {!author?.first_name && !author?.last_name && author?.username}
            {author?.first_name && author?.first_name}{" "}
            {author?.last_name && author?.last_name}
            <div className={styles.underline}></div>
          </h1>
          <div className={styles.avatarContainer}>
            <img src={author?.avatar} alt={author?.username} />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.tabs}>
            <NavLink
              to={`/authors/${author?.username}`}
              className={({ isActive }) => (isActive ? styles.active : "")}
              end
            >
              Recent Work
            </NavLink>
            <NavLink
              to="all"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              All Books
            </NavLink>
          </div>
          <div className={styles.sidebar}>
            {user.id !== author?.id && (
              <button className={styles.followButton} onClick={toggleFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
            <h2>{author?.biography && "About"}</h2>
            <p>{author?.biography}</p>
          </div>
          <div className={styles.outlet}>
            <ProfileAuthorContext.Provider value={{ author }}>
              <Outlet />
            </ProfileAuthorContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

//
// <div className="profile-container">
//   <div className="profile-header-container">
//     <div className="profile-header">
//       {author && (
//         <div className="profile-bio-container">
//           <h1 className="profile-name">{author.username}</h1>
//           <h3 className="profile-bio">
//             Name: {`${author.first_name} ${author.last_name}`}
//           </h3>
//           <p className="profile-bio">{`Bio: ${author.biography}`}</p>
//         </div>
//       )}
//
//       <div>
//         {author && (
//           <img
//             src={author.avatar}
//             alt="Profile Avatar"
//             className="profile-avatar"
//           />
//         )}
//
//        {authenticatedUser && (
//           <Follow
//             token={token}
//             authenticatedUser={authenticatedUser}
//           />
//         )}
//       </div>
//     </div>
//   </div>
//
//   <div className="author-profile-content-page">
//     <div className="main-content-container">
//       <div className="profile-btn-container">
//         <button
//           className="profile-action-button"
//           onClick={() => {
//             setActiveContent("recent");
//           }}
//         >
//           Recent
//         </button>
//         <button
//           className="profile-action-button"
//           onClick={() => {
//             setActiveContent("books");
//           }}
//         >
//           Books
//         </button>
//         <button className="profile-action-button">Chat</button>
//         <button className="profile-action-button">Store</button>
//       </div>
//
//       <div className="content-container flex-margin">
//         <div className="grid-wrapper">
//           {activeContent === "recent" &&
//             recentChapters &&
//             recentChapters.chapters
//
//               .filter((chapter) => {
//                 const associatedBook = books?.find(
//                   (book) =>
//                     book.id === chapter.book_id &&
//                     book.author_id === authenticatedUser.id
//                 );
//                 return associatedBook !== undefined;
//               })
//
//               .sort(
//                 (a, b) => new Date(b.created_at) - new Date(a.created_at)
//               )
//               .map((chapter) => {
//                 const associatedBook = books.find(
//                   (book) =>
//                     book.id === chapter.book_id &&
//                     book.author_id === authenticatedUser.id
//                 );
//                 return (
//                   <div
//                     key={chapter.id}
//                     className="author-content-grid-card"
//                   >
//                     <img
//                       src={
//                         associatedBook
//                           ? associatedBook.cover
//                           : "default-image-path.jpg"
//                       }
//                       alt={`${chapter.title} image`}
//
