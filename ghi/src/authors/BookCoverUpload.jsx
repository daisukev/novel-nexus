import { useEffect, useState, useRef } from "react";
import styles from "./styles/BookCoverUpload.module.css";
import useToken from "../jwt.tsx";
import { useMessageContext } from "../MessageContext";

const BookCoverUpload = ({ book }) => {
  const { createMessage, MESSAGE_TYPES } = useMessageContext();
  const { token, fetchWithToken } = useToken();
  const [prevImage, setPrevImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (book.cover) {
      setPrevImage(book.cover);
    }
  }, [book]);

  const imageChangeHandler = async (e) => {
    const newImage = e.target.files[0];
    setSelectedImage(newImage);
    const formData = new FormData();
    formData.append("image", newImage);
    const url = `${process.env.REACT_APP_API_HOST}/api/books/${book.id}/cover`;
    const options = {
      body: formData,
    };
    const headers = {
      // "Content-Type": "multipart/form-data",
    };

    try {
      const data = await fetchWithToken(url, "POST", headers, options);
      createMessage("Updated book cover.", MESSAGE_TYPES.SUCCESS);
      setPrevImage(data.href);
    } catch (e) {
      console.error(e);
      createMessage("Could not update book cover.", MESSAGE_TYPES.ERROR);
      setSelectedImage(null);
    }
  };
  if (book)
    return (
      <>
        <div
          className={styles.bookCoverUpload}
          onClick={() => {
            imgRef.current.click();
          }}
        >
          Select Image to Upload
          <img
            src={selectedImage ? URL.createObjectURL(selectedImage) : prevImage}
            alt={book.title}
          />
          <div className={styles.hoverIndicator}></div>
          <input
            type="file"
            hidden
            name="image"
            ref={imgRef}
            accept="image/png,image/jpeg"
            onChange={(e) => imageChangeHandler(e)}
          />
        </div>
      </>
    );
};

export default BookCoverUpload;
