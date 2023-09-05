import { useState, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import transparentLogo from "../../transparentlogo.png";
import styles from "./styles/Nav.module.css";
import { SidebarContext, UserContext } from "../../App";
import Avatar from "./Avatar";
import useToken from "../../jwt.tsx";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useToken();
  const { openSidebar, sidebarOpened } = useContext(SidebarContext);
  const { user } = useContext(UserContext);
  const [query, setQuery] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate(`/books/search?q=${query}`);
  };

  return (
    <>
      <header className={styles.header}>
        {!sidebarOpened && (
          <>
            <div>
              <button
                type="button"
                onClick={() => openSidebar()}
                className={styles.burger}
              >
                <i className="ri-menu-line" />
              </button>
            </div>
            <div>
              <NavLink to="/home" className={styles.logo}>
                <img
                  src={transparentLogo}
                  height="50px"
                  width="50px"
                  alt="Novel Nexus Logo"
                  className="logo-img"
                />
                <h1>
                  novel<strong>nexus</strong>
                </h1>
              </NavLink>
            </div>
          </>
        )}
        <form onSubmit={handleSubmit} className={styles.searchBar}>
          <input
            type="text"
            name="q"
            placeholder="Search for books"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <i className="ri-search-line" />
          </button>
        </form>
        {token ? (
          <div className={styles.sideLinks}>
            <NavLink to="/accounts/logout">Log Out</NavLink>
            <Avatar user={user} />
          </div>
        ) : (
          <div className={styles.sideLinks}>
            <NavLink to={`/accounts/login/?prev=${location.pathname}`}>
              Log In
            </NavLink>
            <NavLink to="/accounts/signup">Sign Up</NavLink>
          </div>
        )}
      </header>
    </>
  );
}

export default Nav;
