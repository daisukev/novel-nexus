import { useEffect, useState } from "react";
import Construct from "./Construct.js";
import ErrorNotification from "./ErrorNotification";
import "./App.css";
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import useToken from "./jwt.tsx";

import SignupForm from "./accounts/SignupForm.jsx";
import LoginForm from "./accounts/LoginForm.jsx";
import Logout from "./accounts/Logout.jsx";
import LandingPage from "./landingPage/index.js";
import BookList from "./pages/books/BookList.js";
import BookDetail from "./pages/books/BookDetail.js";

function App() {
  const { token } = useToken();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (token) {
      setUser(JSON.parse(atob(token.split(".")[1])).account);
    }
  }, [token]);

  // const LandingPage = () => {
  //   return (
  //     <>
  //       <LandingPage />
  //       <h2>{token && "Welcome back," + user.username}</h2>
  //     </>

  //   )
  // };

  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="/accounts">
        <Route path="signup" element={<SignupForm />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="logout" element={<Logout />} />
      </Route>
      <Route path="/books" element={<BookList />} />
      <Route path="/books/:bookId" element={<BookDetail />} />
    </Routes>
  );
}

export default App;
