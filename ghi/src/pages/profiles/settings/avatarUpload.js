import React, { useState, useEffect, useRef, useContext } from "react";
import useToken from "../../../jwt.tsx";
import "../css/settings.css";
import { fetchAuthor } from "../../../actions";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../App";
import { useMessageContext } from "../../../MessageContext";

function AvatarUpload() {
  const { createMessage, MESSAGE_TYPES } = useMessageContext();
  const { fetchLoggedInUser, user } = useContext(UserContext);
  const { token, fetchWithToken } = useToken();
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [prevImage, setPrevImage] = useState(null);

  useEffect(() => {
    if (user.avatar) {
      setPrevImage(user.avatar);
    }
  }, [user]);

  const imageChangeHandler = async (e) => {
    const newImage = e.target.files[0];
    setSelectedImage(newImage);
    const formData = new FormData();
    formData.append("image", newImage);
    const url = `${process.env.REACT_APP_API_HOST}/api/authors/avatar`;
    const options = {
      body: formData,
    };
    const headers = {
      // "Content-Type": "multipart/form-data",
    };

    try {
      const data = await fetchWithToken(url, "POST", headers, options);
      createMessage("Updated profile avatar.", MESSAGE_TYPES.SUCCESS);
      console.log(data);
      fetchLoggedInUser();
      // setPrevImage(data.href);
    } catch (e) {
      console.error(e);
      createMessage("Could not update profile avatar.", MESSAGE_TYPES.ERROR);
      setSelectedImage(null);
    }
  };
  const handleImageUpload = async (event) => {
    console.log("here");
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/authors/avatar`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      if (response.ok) {
        const imageResponse = await response.json();
        console.log(imageResponse);
        fetchLoggedInUser();
      } else {
        console.error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <>
      <div className="profile-image-container">
        <img
          src={selectedImage ? URL.createObjectURL(selectedImage) : prevImage}
          alt={user.username}
        />
        <button
          className="profile-image-label"
          style={{ opacity: prevImage ? 0 : 1 }}
          onClick={() => fileInputRef.current.click()}
        >
          Select Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          id="profileImageInput"
          accept="image/*"
          onChange={(e) => {
            imageChangeHandler(e);
          }}
          style={{ display: "none" }}
        />
      </div>
    </>
  );
}

export default AvatarUpload;
