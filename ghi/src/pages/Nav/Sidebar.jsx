import { NavLink } from "react-router-dom";
import transparentLogo from "../../transparentlogo.png";
import styles from "./styles/Sidebar.module.css";
const Sidebar = ({ authenticatedUser, sidebarOpened, closeSidebar }) => {
  // TODO: small screen -> needs to close sidebar once a link has been clicked.
  return (
    <div className={`${styles.sidebar} ${sidebarOpened && styles.sidebarOpen}`}>
      <nav id="nav" className={styles.nav}>
        <div className={styles.sidebarHeader}>
          <NavLink to="/home">
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
          <button onClick={() => closeSidebar()} className={styles.closeButton}>
            <i className="ri-close-line" />
          </button>
        </div>
        <ul className="nav-ul">
          <li className="nav-list">
            <NavLink to="/home">Home</NavLink>
          </li>

          <li className="nav-list">
            <NavLink to="/books">Books</NavLink>
          </li>

          <li className="nav-list">
            <NavLink to="/books/genres">Genres</NavLink>
          </li>

          {authenticatedUser && (
            <>
              <li className="nav-list">
                <h2 className="username-greet">
                  Welcome, {authenticatedUser.username}
                </h2>
              </li>
              <li className="nav-list">
                {/* <NavLink to={`/accounts/profile/${authenticatedUser.username}`}>Profile Page</NavLink> */}
                <NavLink to={`/authors/${authenticatedUser.username}`}>
                  Profile Page
                </NavLink>
              </li>
              <li className="nav-list">
                {/* <NavLink to={`/accounts/profile/${authenticatedUser.username}`}>Profile Page</NavLink> */}
                <NavLink to={`/my/workspace/`}>My Workspace</NavLink>
              </li>
              <li className="menu-list">
                <NavLink
                  to={`/my/settings/${authenticatedUser.id}`}
                  className="menu-link"
                >
                  Settings
                </NavLink>
              </li>
              <li className="menu-list">
                <NavLink to={`/my/read-history/`} className="menu-link">
                  Read History
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
