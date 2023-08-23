import { useEffect } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const { logout, token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) logout();
  }, [token]);

  return <div>Logged out</div>;
}
