import { useEffect, useState } from "react";
import useToken from "../jwt.tsx";

import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { login, token } = useToken();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.username, formData.password);
    } catch (error) {
      setMessage("Incorrect username or password.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">username:</label>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            value={formData.username}
          />
        </div>

        <div>
          <label htmlFor="password">password:</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
          />
          <span style={{ color: "red" }}>{message}</span>
        </div>
        <button type="submit">Log In.</button>
      </form>
    </>
  );
}
