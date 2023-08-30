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
import BookListWorkspace from "./authors/BookListWorkspace";
import BookDetailWorkspace from "./authors/BookDetailWorkspace.jsx";

import ChapterView from "./pages/ChapterView.js";
import BookList from "./pages/books/BookList.js";
import BookDetail from "./pages/books/BookDetail.js";
import ChapterEditor from "./authors/ChapterEditor.jsx";

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
    <>
      <Routes>
        <Route index element={<LandingPage />} />
      <Route path="my">
        <Route path="workspace">
          <Route index element={<BookListWorkspace />} />
          <Route path="books/:bookId" element={<BookDetailWorkspace />}>
            <Route path="chapters/:chapterId" element={<ChapterEditor />} />
          </Route>
        </Route>
      </Route>
        <Route path="/accounts">
          <Route path="signup" element={<SignupForm />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      <Route path="/books" element={<BookList />} />
      <Route path="/books/:bookId" element={<BookDetail />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:bookId" element={<BookDetail />} />
        <Route path="/chapters/:chapterId" element={<ChapterView />} />
      </Routes>
    </>
  );
}

export default App;
