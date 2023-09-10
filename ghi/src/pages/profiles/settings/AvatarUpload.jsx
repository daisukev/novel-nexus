import React, { useState, useEffect, useRef, useContext } from "react";
import useToken from "../../../jwt.tsx";
import "../css/settings.css";
import { UserContext } from "../../../App";
import { useMessageContext } from "../../../MessageContext";

function AvatarUpload() {
  const { fetchLoggedInUser, user } = useContext(UserContext);
  const { createMessage, MESSAGE_TYPES } = useMessageContext();
  const { fetchWithToken } = useToken();
  const [prevImage, setPrevImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

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
    const headers = {};

    try {
      const data = await fetchWithToken(url, "POST", headers, options);
      createMessage("Updated profile avatar.", MESSAGE_TYPES.SUCCESS);
      setPrevImage(data.href);
      fetchLoggedInUser();
    } catch (e) {
      console.error(e);
      createMessage("Could not update profile avatar.", MESSAGE_TYPES.ERROR);
      setSelectedImage(null);
    }
  };

  return (
    <>
      <div
        className="profile-image-container"
        onClick={() => fileInputRef.current.click()}
      >
        Upload Photo
        <img
          src={selectedImage ? URL.createObjectURL(selectedImage) : prevImage}
          alt={user.username}
        />
        <input
          type="file"
          hidden
          name="image"
          ref={fileInputRef}
          id="profileImageInput"
          accept="image/png,image/jpeg"
          onChange={(e) => {
            imageChangeHandler(e);
          }}
        />
      </div>
    </>
  );
}

export default AvatarUpload;
