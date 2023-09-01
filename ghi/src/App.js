import { useEffect, useState } from "react";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import useToken from "./jwt.tsx";

import SignupForm from "./accounts/SignupForm.jsx";
import LoginForm from "./accounts/LoginForm.jsx";
import Logout from "./accounts/Logout.jsx";
import LandingPage from "./landingPage/index.js";
import BookListWorkspace from "./authors/BookListWorkspace";
import BookDetailWorkspace from "./authors/BookDetailWorkspace.jsx";
import Home from "./pages/main/Home.js";
import ProfilePage from "./pages/profiles/ProfilePage.js";

import ChapterView from "./pages/ChapterView.js";
import BookList from "./pages/books/BookList.js";
import BookDetail from "./pages/books/BookDetail.js";
import ChapterEditor from "./authors/ChapterEditor.jsx";
import SearchBar from "./pages/books/SearchBar/index.js";
import withAuthRedirect from "./components/withAuthRedirect";

function App() {
  const { token } = useToken();
  const [user, setUser] = useState({});

  useEffect(() => {}, []);

  useEffect(() => {
    if (token) {
      setUser(JSON.parse(atob(token.split(".")[1])).account);
    }
  }, [token]);

  const AuthChapterEditor = withAuthRedirect(ChapterEditor);
  const AuthBookDetailWorkspace = withAuthRedirect(BookDetailWorkspace);

  return (
    <>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/home" element={<Home token={token} user={user} />} />
        <Route path="my">
          <Route path="workspace">
            <Route index element={<BookListWorkspace />} />
            <Route path="books/:bookId" element={<AuthBookDetailWorkspace />}>
              <Route
                path="chapters/:chapterId"
                element={<AuthChapterEditor />}
              />
            </Route>
          </Route>
        </Route>
        <Route path="/accounts">
          <Route path="signup" element={<SignupForm />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      <Route path="/books" element={<BookList />} />
      <Route path="/books/search" element={<SearchBar />}/>
      <Route path="/books/:bookId" element={<BookDetail />} />
        <Route path="/chapters/:chapterId" element={<ChapterView />} />

        <Route path="/profile">
          <Route
            path="view/:author_id"
            element={<ProfilePage authenticatedUser={user} />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
