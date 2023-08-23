import { useEffect, useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";

export default function SignupForm() {
  const { register } = useToken();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMesage] = useState("");

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

  const passwordMismatch = <span style={{ color: "red" }}>{errorMessage}</span>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <>
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
    </>
  );
}
