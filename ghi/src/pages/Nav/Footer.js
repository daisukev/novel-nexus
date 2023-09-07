import React from 'react'
import './styles/footer.css'
import logo from '../../transparentlogo.png'

function Footer(){


return (
    <>
        <footer className="footer-container">
            <div className="footer-logo">
                <img src={logo} alt="Nexus Logo" />
            </div>
            <div className="divider"></div>

            <div className="footer-section">
               <h3>Browse</h3>
                  <ul>
                    <li>Home</li>
                    <li>books</li>
                    <li>recent</li>
                    <li>genre</li>
                </ul>
            </div>
            <div className="divider"></div>

            <div className="footer-section">
                <h3>Authors</h3>
                <ul>
                    <li>How to Start Writing</li>
                      <li>Publishing Guideline</li>
                      <li>Author Dashboard</li>
                </ul>
            </div>
            <div className="divider"></div>

            <div className="footer-section">
                <h3>Resources</h3>
                <ul>
                    <li>Tutorials</li>
                    <li>Community Guides</li>
                    <li>Writing Prompts</li>
                </ul>
            </div>
            <div className="divider"></div>
            <div className="footer-section">
                <h3>Legal</h3>
                <ul>
                    <li>Terms of Service</li>
                    <li>Term of Conduct</li>
                    <li>Privacy Policy</li>
                    <li>Copyright Notice</li>
                </ul>
            </div>



            <div className="divider"></div>
            <div className="footer-section">
                <h3>Stay Connected</h3>
                <ul>
                    <li><a href="https://facebook.com/yourwebsite"><i className="fab fa-facebook"></i></a></li>
                    <li><a href="https://facebook.com/yourwebsite"><i className="fab fa-instagram"></i></a></li>
                    <li><a href="https://facebook.com/yourwebsite"><i className="fab fa-facebook"></i></a></li>

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
