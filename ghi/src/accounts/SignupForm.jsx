import { useEffect, useState } from "react";
import useToken from "../jwt.tsx";
import { useNavigate } from "react-router-dom";
import styles from "./styles/SignupForm.module.css";
import Nav from "../pages/Nav/Nav";
import { useMessageContext } from "../MessageContext";

export default function SignupForm() {
  const navigate = useNavigate();
  const { createMessage, MESSAGE_TYPES } = useMessageContext();
  const { register, token } = useToken();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMesage] = useState("");

  useEffect(() => {
    if (token) {
      createMessage(
        "Created user! Redirecting...",
        MESSAGE_TYPES.SUCCESS,
        2500
      );
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.confirmPassword || !formData.password || !formData.username) {
      setShowError(true);
      setErrorMesage("You must fill out all fields.");
      return;
    }
    if (formData.confirmPassword !== formData.password) {
      setShowError(true);
      setErrorMesage("Passwords must match!");
      return;
    }

    const userData = {
      username: formData.username,
      password: formData.password,
    };

    const url = `${process.env.REACT_APP_API_HOST}/api/authors`;
    register(userData, url);

    // navigate to home page
  };

  useEffect(() => {
    if (
      formData.confirmPassword &&
      formData.confirmPassword !== formData.password
    ) {
      setShowError(true);
      setErrorMesage("Passwords must match.");
    } else {
      setShowError(false);
    }
  }, [formData]);

  const passwordMismatch = <span className={styles.error}>{errorMessage}</span>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div className={styles.signupForm}>
          <h1>Sign Up</h1>
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
            </div>
            <div>
              <label htmlFor="confirmPassword">confirm password:</label>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                value={formData.confirmPassword}
              />
              {showError && passwordMismatch}
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
