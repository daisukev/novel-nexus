import { NavLink } from "react-router-dom";
import transparentLogo from "../../transparentlogo.png";
import styles from "./styles/Sidebar.module.css";
import useToken from "../../jwt.tsx";
import { Search } from "./Nav";

const Sidebar = ({ authenticatedUser, sidebarOpened, closeSidebar }) => {
  const { token } = useToken();

  const handleNavClick = () => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    if (mediaQuery.matches) {
      closeSidebar();
    }
  };
  return (
    <div className={`${styles.sidebar} ${sidebarOpened && styles.sidebarOpen}`}>
      <nav id="nav" className={styles.nav}>
        <div className={styles.sidebarHeader}>
          <NavLink onClick={handleNavClick} to="/home">
            <img
              src={transparentLogo}
              height="50px"
              width="50px"
              alt="Novel Nexus Logo"
              className={styles.imgLogo}
            />
          </NavLink>
          <NavLink onClick={handleNavClick} to="/home">
            <h1>
              novel<strong>nexus</strong>
            </h1>
          </NavLink>
          <button onClick={() => closeSidebar()} className={styles.closeButton}>
            <i className="ri-close-line" />
          </button>
        </div>
        <ul className={styles.navUl}>
          <li>
            <h2>Main</h2>
          </li>
          <li>
            <NavLink
              className={styles.sidebarLink}
              onClick={handleNavClick}
              to="/home"
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              className={styles.sidebarLink}
              onClick={handleNavClick}
              to="/books"
            >
              Books
            </NavLink>
          </li>

          <li>
            <NavLink
              className={styles.sidebarLink}
              onClick={handleNavClick}
              to="/books/genres"
            >
              Genres
            </NavLink>
          </li>

          {token && (
            <>
              <li>
                <h2>{authenticatedUser.username}</h2>
              </li>
              <li>
                {/* <NavLink className={styles.sidebarLink} onClick={handleNavClick} to={`/accounts/profile/${authenticatedUser.username}`}>Profile Page</NavLink> */}
                <NavLink
                  className={styles.sidebarLink}
                  onClick={handleNavClick}
                  to={`/authors/${authenticatedUser.username}`}
                >
                  Profile Page
                </NavLink>
              </li>
              <li>
                {/* <NavLink className={styles.sidebarLink} onClick={handleNavClick} to={`/accounts/profile/${authenticatedUser.username}`}>Profile Page</NavLink> */}
                <NavLink
                  className={styles.sidebarLink}
                  onClick={handleNavClick}
                  to={`/my/workspace/`}
                >
                  Workspace
                </NavLink>
              </li>
              <li className="menu-list">
                <NavLink
                  onClick={handleNavClick}
                  to={`/my/settings/${authenticatedUser.id}`}
                  className={styles.sidebarLink}
                >
                  Settings
                </NavLink>
              </li>
              <li className="menu-list">
                <NavLink
                  onClick={handleNavClick}
                  to={`/my/read-history/`}
                  className={styles.sidebarLink}
                >
                  Read History
                </NavLink>
              </li>
              <li className="menu-list">
                <NavLink
                  onClick={handleNavClick}
                  to={`/following`}
                  className={styles.sidebarLink}
                >
                  Following
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
