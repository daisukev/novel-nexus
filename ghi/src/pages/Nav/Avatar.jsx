import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import styles from "./styles/Avatar.module.css";

const Avatar = () => {
  const { user } = useContext(UserContext);
  const backup = "https://ui-avatars.com/api/?size=512&name=";
  const handleError = (e) => {
    e.target.src = `${backup}${user.username}`;
  };

  if (user)
    return (
      <div className={styles.side}>
        <Link to={`/profile/view/${user.username}`}>{user.username}</Link>
        <div
          className={styles.avatar}
          styles={{ backgroundImage: `url${backup}${user.username}` }}
        >
          <img
            src={user.avatar ? user.avatar : ""}
            alt={`${user.username}`}
            onError={handleError}
          />
        </div>
      </div>
    );
};

export default Avatar;
