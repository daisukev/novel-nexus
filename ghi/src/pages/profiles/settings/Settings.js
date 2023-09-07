import React, { useState } from "react";
import "../css/settings.css";
import styles from "../css/settings.module.css";
import HamburgerMenu from "../HamburgerMenu";
import AvatarUpload from "./avatarUpload";
import UpdateUserInfo from "./UpdateUserInfo";
import Nav from "../../Nav/Nav";

function Settings({ token, user }) {
  const [activeContent, setActiveContent] = useState("profileInfo");

  return (
    <>
      <Nav />
      <div className="admin-account-profile">
        <div className="setting-banner">
          <div className="profile-image-container">
            <AvatarUpload token={token} authenticatedUser={user} />
          </div>
        </div>

        <div className="setting-data-container">
          <div className="setting-information-container">
            <UpdateUserInfo token={token} authenticatedUser={user} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
