import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* Logo + About */}
                <div className="footer-section">
                    <div className="logo-footer">
                        <span className="logo-text-footer">
                            <span className="logo-e-footer">R</span>eadify
                        </span>
                    </div>

                    <p className="footer-about">
                        Readify is a project-level digital library application developed
                        strictly for educational purposes, showcasing a
                        full-stack MERN architecture with modern UI/UX principles.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-section-quick">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li>
                            <Link to="/">Browse Books</Link>
                        </li>
                        <li>
                            <Link to="/AddBook">My Library</Link>
                        </li>
                        <li>
                            <Link to="/borrow-requests">Borrow History</Link>
                        </li>
                        <li>
                            <Link to="/profile">User Profile</Link>
                        </li>
                        <li>
                            <Link to="/Login">Help & Support</Link>
                        </li>
                    </ul>
                </div>


                {/* MERN Stack */}
                <div className="footer-section">
                    <h4>MERN Tech Stack</h4>
                    <div className="mern-logos">
                        <i className="devicon-mongodb-plain colored"></i>
                        <i className="devicon-express-original"></i>
                        <i className="devicon-react-original colored"></i>
                        <i className="devicon-nodejs-plain colored"></i>
                    </div>
                    <p className="stack-text">
                        Built using MongoDB, Express, React & Node.js
                    </p>
                </div>

                {/* Project Info */}
                <div className="footer-section">
                    <h4>Project Info</h4>
                    <p>Academic MERN Project</p>
                    <p>REST API Based System</p>
                    <p>Secure Authentication Flow</p>
                </div>

            </div>

            {/* Bottom */}
            <div className="footer-bottom">
                © 2026 <span>vivekp-codes</span>. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
