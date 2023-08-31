import useToken from "../jwt.tsx";
import { useState, useEffect } from "react";

export default function BookDetailsEditor({ book }) {
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
    <div>
      <h3>Edit Details</h3>
      <form onSubmit={handleSubmit}>
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
          <textarea
            value={formData.summary}
            onChange={handleChange}
            type="text"
            name="summary"
          />
        </div>
        <label htmlFor="is_published">Published? </label>
        <input
          name="is_published"
          checked={formData.is_published}
          onChange={handleChange}
          type="checkbox"
        />
        <div>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}
