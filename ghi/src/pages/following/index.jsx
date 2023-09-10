import { useEffect, useState, useCallback } from "react";
import Nav from "../Nav/Nav";
import styles from "./index.module.css";
import AuthorCard from "./AuthorCard";
import useToken from "../../jwt.tsx";

const Following = () => {
  const { token, fetchWithToken } = useToken();
  const [followedAuthors, setFollowedAuthors] = useState([]);

  const fetchFollowedAuthors = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_HOST}/api/my/follows`;
    try {
      const { authors } = await fetchWithToken(url);
      setFollowedAuthors(authors);
    } catch (e) {
      console.error(e);
    }
  }, [fetchWithToken]);

  useEffect(() => {
    if (token) {
      fetchFollowedAuthors();
    }
  }, [token]);

  return (
    <div className={styles.container}>
      <Nav />
      <div className={styles.following}>
        <h2>Following</h2>
        <div className={styles.cardContainer}>
          {followedAuthors.map((author) => {
            return <AuthorCard author={author} key={author.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Following;
