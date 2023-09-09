import { useEffect } from "react";
import useToken from "../jwt.tsx";
import { useNavigate } from "react-router-dom";
import Nav from "../pages/Nav/Nav";

export default function Logout() {
  const { logout, token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      logout();
    }
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }, [token, logout]);

  return (
    <div>
      <Nav />
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100%",
          padding: "1rem",
        }}
      >
        <h2>Logged out. Redirecting...</h2>
      </div>
    </div>
  );
}
