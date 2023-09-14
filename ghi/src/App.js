import { useEffect, useState, createContext } from "react";
import "./App.module.css";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import useToken from "./jwt.tsx";

import SignupForm from "./accounts/SignupForm.jsx";
import LoginForm from "./accounts/LoginForm.jsx";
import Logout from "./accounts/Logout.jsx";
import LandingPage from "./landingPage/index.js";
import BookListWorkspace from "./authors/BookListWorkspace";
import BookDetailWorkspace from "./authors/BookDetailWorkspace.jsx";
import Home from "./pages/main/Home.js";
import ProfilePage from "./pages/profiles/ProfilePage.js";
import Settings from "./pages/profiles/settings/Settings.js";
import Nav from "./pages/Nav/Nav";

import ChapterView from "./pages/chapters/ChapterView.js";
import BookList from "./pages/books/BookList.js";
import BookDetail from "./pages/books/BookDetail.js";
import ChapterEditor from "./authors/ChapterEditor.jsx";
import SearchBar from "./pages/books/SearchBar/index.js";
import withAuthRedirect from "./components/withAuthRedirect";
import Genres from "./pages/books/Genres";
import GenresPage from "./pages/books/GenresPage";
import styles from "./App.module.css";
import Sidebar from "./pages/Nav/Sidebar";
import MessageProvider from "./MessageContext";
import MessageQueue from "./components/MessageQueue";
import { fetchAuthor } from "./actions";
import ReadHistory from "./pages/chapters/ReadHistory";
import Recent from "./pages/profiles/Recent";
import AllBooks from "./pages/profiles/AllBooks";
import Following from "./pages/following";
import WebSocketClient from "./components/WebSockets";
import ChatClient from "./pages/profiles/Chat";

export const SidebarContext = createContext();
export const UserContext = createContext();

function App() {
  const { token, fetchWithCookie } = useToken();
  const [user, setUser] = useState({});
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const openSidebar = () => {
    setSidebarOpened(true);
  };
  const closeSidebar = () => {
    setSidebarOpened(false);
  };

  const fetchLoggedInUser = async () => {
    if (token) {
      const newToken = await fetchWithCookie(
        `${process.env.REACT_APP_API_HOST}/token`
      );

      const account = newToken.account;
      setUser(account);
    }
  };

  useEffect(() => {}, []);

  useEffect(() => {
    fetchLoggedInUser();
  }, [token]);

  const AuthChapterEditor = withAuthRedirect(ChapterEditor);
  const AuthBookDetailWorkspace = withAuthRedirect(BookDetailWorkspace);

  return (
    <div className={styles.root}>
      <UserContext.Provider value={{ user, fetchLoggedInUser, setUser }}>
        <MessageProvider>
          <SidebarContext.Provider
            value={{ openSidebar, closeSidebar, sidebarOpened }}
          >
            <Sidebar
              authenticatedUser={user}
              closeSidebar={closeSidebar}
              sidebarOpened={sidebarOpened}
            />
            <div className={styles.main}>
              <Routes>
                <Route path="*" element={<NoMatch />} />
                {token ? (
                  <Route index element={<Home token={token} user={user} />} />
                ) : (
                  <Route index element={<LandingPage />} />
                )}
                <Route
                  path="/home"
                  element={<Home token={token} user={user} />}
                />
                <Route path="/following" element={<Following />} />
                <Route path="my">
                  <Route
                    path="settings/:author_id"
                    element={
                      <Settings token={token} authenticatedUser={user} />
                    }
                  />
                  <Route path="read-history" element={<ReadHistory />} />
                  <Route path="workspace">
                    <Route path="*" element={<NoMatch />} />
                    <Route index element={<BookListWorkspace />} />
                    <Route
                      path="books/:bookId"
                      element={<AuthBookDetailWorkspace />}
                    >
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
                  <Route path="*" element={<NoMatch />} />
                </Route>
                <Route path="/books" element={<BookList />} />
                <Route path="/books/search" element={<SearchBar />} />
                <Route path="/books/genres/" element={<GenresPage />} />
                <Route path="/books/genres/:genre" element={<Genres />} />
                <Route path="/books/:bookId" element={<BookDetail />} />
                <Route
                  path="/books/:bookId/chapters/:chapterId"
                  element={<ChapterView />}
                />

                <Route path="/authors">
                  <Route
                    path=":author_id"
                    element={
                      <ProfilePage authenticatedUser={user} token={token} />
                    }
                  >
                    <Route index element={<Recent />} />
                    <Route path="chat" element={<ChatClient />} />
                    <Route path="all" element={<AllBooks />} />
                  </Route>
                </Route>
              </Routes>
              <WebSocketClient />
            </div>
          </SidebarContext.Provider>
          <MessageQueue />
        </MessageProvider>
      </UserContext.Provider>
    </div>
  );
}

const NoMatch = () => {
  const location = useLocation();

  return (
    <div>
      <Nav />
      <div style={{ padding: "5rem" }}>No Match for {location.pathname}</div>
    </div>
  );
};

export default App;
