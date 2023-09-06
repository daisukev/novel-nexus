import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './css/hamburgerMenu.css'



function HamburgerMenu( { authenticatedUser }){
    const [isMenuOpen, setMenuOpen] = useState();

    return (
        <>
        <div className="hamburger-container">

        <div className="hamburger" onClick={() => setMenuOpen(!isMenuOpen)}>
          ☰
        </div>

        {isMenuOpen && (
            <div className="menu">
                <ul>
                <li className="menu-list">
                        <Link to="/my/workspace" className="menu-link">My Workspace</Link>
                    </li>
                    <li className="menu-list">
                        <Link to={`/profile/view/${authenticatedUser.username}`} className="menu-link">Profile</Link>
                    </li>
                    <li className="menu-list">
                        <Link to={`/profile/settings/${authenticatedUser.id}`} className="menu-link">Settings</Link>
                    </li>
                    <li className="menu-list">
                        <Link to="/accounts/logout" className="menu-link">Log Out</Link>
                    </li>
                </ul>

            </div>
        )}
    </div>
    </>
    )
}

export default HamburgerMenu;
