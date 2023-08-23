import { useEffect, useState } from "react";
import Construct from "./Construct.js";
import ErrorNotification from "./ErrorNotification";
import "./App.css";
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react";

import SignupForm from "./accounts/SignupForm.jsx";
import LoginForm from "./accounts/LoginForm.jsx";
import Logout from "./accounts/Logout.jsx";
//

function App() {
  const { token } = useToken();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (token) {
      setUser(JSON.parse(atob(token.split(".")[1])).account);
    }
  }, [token]);

  const LandingPage = () => {
    return (
      <div>
        <h1>Landing Page</h1>
        <h2>{token && "Welcome back," + user.username}</h2>
      </div>
    );
  };

  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="/accounts">
        <Route path="signup" element={<SignupForm />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="logout" element={<Logout />} />
      </Route>
    </Routes>
  );
}

export default App;
