import React from 'react'
import './nav.css'


function Footer(){


return (
    <>
        <footer className="footer-container">
            <div className="footer-logo">
                <img src="" alt="Nexus Logo" />
            </div>

            <div className="footer-section">
               <h3>Browse</h3>
                  <ul>
                    <li>Home</li>
                    <li>About</li>
                </ul>
            </div>

            <div className="footer-section">
                <h3>Authors</h3>
                <ul>
                    <li>How to Start Writing</li>
                      <li>Publishing Guideline</li>
                      <li>Author Dashboard</li>
                </ul>
            </div>

            <div className="footer-section">
                <h3>Resources</h3>
                <ul>
                    <li>Tutorials</li>
                    <li>Community Guides</li>
                    <li>Writing Prompts</li>
                </ul>
            </div>
            <div className="footer-section">
                <h3>Legal</h3>
                <ul>
                    <li>Terms of Service</li>
                    <li>Term of Conduct</li>
                    <li>Privacy Policy</li>
                    <li>Copyright Notice</li>
                </ul>
            </div>

            <div className="footer-section">
                <h3>Stay Connected</h3>
                <ul>
                    <li><a href="https://facebook.com/yourwebsite">Facebook</a></li>
                </ul>
            </div>

            <div className="copyright">
                © 2023, Novel Nexus. All rights reserved.
            </div>
        </footer>

    </>
)

}

export default Footer;
