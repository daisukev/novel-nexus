import { useEffect } from "react";
import useToken from "../jwt.tsx";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const { logout, token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) logout();
  }, [token]);

  return <div>Logged out</div>;
}
