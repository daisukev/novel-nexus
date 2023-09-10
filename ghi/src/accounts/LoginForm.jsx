import { useEffect, useState } from "react";
import useToken from "../jwt.tsx";
import styles from "./styles/LoginForm.module.css";

import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Nav from "../pages/Nav/Nav";
import { useMessageContext } from "../MessageContext";

export default function LoginForm() {
  const { createMessage, MESSAGE_TYPES } = useMessageContext();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { login, token, logout } = useToken();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (token) {
      const prev = searchParams.get("prev");
      if (prev) {
        navigate(prev);
      } else {
        navigate("/home");
      }
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (token) {
      logout();
    }
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
      <Nav />
      <div className={styles.container}>
        <div className={styles.loginForm}>
          <h1>Login</h1>

          <p>
            Not currently a user?{" "}
            <Link to="/accounts/signup">Sign up here!</Link>{" "}
          </p>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">username:</label>
              <input
                tabIndex={1}
                type="text"
                name="username"
                onChange={handleChange}
                value={formData.username}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password">password:</label>
              <input
                tabIndex={2}
                type="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
              />
              <span className={styles.error}>{message}</span>
            </div>
            <button type="submit">Log In</button>
          </form>
        </div>
      </div>
    </>
  );
}
