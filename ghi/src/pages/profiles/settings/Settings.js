import React, { useState } from "react";
import "../css/settings.css";
import "../css/settings.module.css";
import AvatarUpload from "./AvatarUpload";
import UpdateUserInfo from "./UpdateUserInfo";
import Nav from "../../Nav/Nav";

function Settings({ token, user }) {
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
