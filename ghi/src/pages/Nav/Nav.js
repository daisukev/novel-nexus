import React from 'react'
import {NavLink} from 'react-router-dom'
import testLogo from '../images/test-logo.png'
import './nav.css'


function Nav({ authenticatedUser }){
    return(
        <>
        <header>
            <div className="nexus-header">
                <div className="header-flex">
                <div className="nexus-logo">

                    <NavLink to="/home" ><img src={testLogo} className="logo-img"/></NavLink>
                </div>


             <nav id="nav">
                 <ul className="nav-ul">
                     <li className="nav-list">
                         <NavLink to="/home">Home</NavLink>
                     </li>

                     <li  className="nav-list">
                        <NavLink to="/books">Books</NavLink>
                        </li>
                        <li  className="nav-list">
                        <NavLink to="#">eBooks</NavLink>
                        </li>
                        <li  className="nav-list">
                        <NavLink to="#">Audio</NavLink>
                 </li>
                 {authenticatedUser && (
                     <>
                     <li className="nav-list">
                         <h2 className="username-greet">Welcome, {authenticatedUser.username}</h2>
                     </li>
                     <li className="nav-list">
                         {/* <NavLink to={`/accounts/profile/${authenticatedUser.username}`}>Profile Page</NavLink> */}
                         <NavLink to={`/profile/view/${authenticatedUser.username}`}>Profile Page</NavLink>

                     </li>
                     </>
                 ) }
                 </ul>
             </nav>
            </div>
            </div>
        </header>









        </>
    )
}


export default Nav;
