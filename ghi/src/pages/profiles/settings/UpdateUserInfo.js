import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/settings.css";
import styles from "../css/settings.module.css";
import TextArea from "../../../components/TextArea";
import { useMessageContext } from "../../../MessageContext";

function UpdateUserInfo({ token }) {
  const { createMessage, MESSAGE_TYPES } = useMessageContext();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { author_id } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    biography: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/authors/${author_id}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        createMessage("Updated author profile", MESSAGE_TYPES.SUCCESS);
        setUpdateSuccess(true);
      } else {
        createMessage("Could not update author profile", MESSAGE_TYPES.ERROR);
      }
    } catch (error) {
      createMessage("Could not update author profile", MESSAGE_TYPES.ERROR);
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/api/authors/${author_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const authorData = await response.json();
          setFormData(authorData);
        } else {
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchAuthorData();
  }, [author_id, token]);

  return (
    <>
      <div>
        <form onSubmit={handleFormSubmit} className="personal-info-form">
          <h2 className="personal-info-header">Personal Details:</h2>
          <div className="input-group">
            <label className="personal-info-label">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="personal-info-input"
              autoComplete="current-password"
            />
          </div>
          <div className="input-group">
            <label className="personal-info-label">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="personal-info-input"
              autoComplete="current-password"
            />
          </div>
          <h2 className="personal-info-header">Account Details:</h2>

          <div className="input-group">
            <label className="personal-info-label">Biography:</label>
            <TextArea
              className={styles.textArea}
              name="biography"
              value={formData.biography || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label className="personal-info-label">First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleInputChange}
              className="personal-info-input"
            />
          </div>
          <div className="input-group">
            <label className="personal-info-label">Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleInputChange}
              className="personal-info-input"
            />
          </div>
          <h2 className="personal-info-header">Contact Information:</h2>

          <div className="input-group">
            <label className="personal-info-label">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              className="personal-info-input"
            />
          </div>
          <div className="setting-btn-box">
            <button className="setting-save-btn" type="submit">
              Update
            </button>
          </div>
          {updateSuccess && (
            <p className="success-message">Successfully updated!</p>
          )}
        </form>
      </div>
    </>
  );
}
export default UpdateUserInfo;
