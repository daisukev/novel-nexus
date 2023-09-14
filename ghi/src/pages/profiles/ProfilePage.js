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
            <NavLink
              to="chat"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Chat
            </NavLink>
          </div>
          <div className={styles.sidebar}>
            {user.id !== author?.id && token && (
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
