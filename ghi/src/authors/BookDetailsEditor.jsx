import useToken from "../jwt.tsx";
import { useState, useEffect } from "react";
import BookCoverUpload from "./BookCoverUpload";
import styles from "./styles/BookDetailsEditor.module.css";
import TextArea from "../components/TextArea";
import { useMessageContext } from "../MessageContext";
import GenresEditor from "./GenresEditor";

export default function BookDetailsEditor({ book, fetchBook }) {
  const { createMessage, MESSAGE_TYPES } = useMessageContext();
  const { token, fetchWithToken } = useToken();
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    is_published: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_HOST}/api/books/${book.id}`;
    const headers = {
      "Content-Type": "application/json",
    };
    const options = {
      body: JSON.stringify(formData),
    };
    if (token) {
      try {
        const res = await fetchWithToken(url, "PUT", headers, options);
        createMessage("Updated Book Details", MESSAGE_TYPES.SUCCESS);
        fetchBook(book.id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    setFormData({
      title: book.title ? book.title : "",
      summary: book.summary ? book.summary : "",
      is_published: book.is_published ? book.is_published : false,
    });
  }, [book]);

  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className={styles.bookDetails}>
      <div className={styles.upload}>
        <BookCoverUpload book={book} />
      </div>
      <form onSubmit={handleSubmit} className={styles.bookDetailsForm}>
        <h2>{book.title}</h2>
        <h3>Edit Details</h3>
        <GenresEditor book={book} />
        <div>
          <label htmlFor="title">Title: </label>
          <input
            value={formData.title}
            onChange={handleChange}
            type="text"
            name="title"
          />
        </div>
        <div>
          <label htmlFor="summary">Summary: </label>
          <TextArea
            value={formData.summary}
            onChange={handleChange}
            type="text"
            name="summary"
          />
        </div>
        <div className={styles.checkbox}>
          <label htmlFor="is_published">Published? </label>
          <input
            name="is_published"
            checked={formData.is_published}
            onChange={handleChange}
            type="checkbox"
          />
        </div>
        <div>
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
