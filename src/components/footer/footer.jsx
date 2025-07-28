import React from "react";
import { TbPencilCode } from "react-icons/tb";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

import "./footer.css";

function Footer() {
    return(
        <footer className="footer">
                    <div className="footer-content">
                        <div className="footer-grid">
                            <div className="footer-section">
                                <div className="footer-brand">
                                    <TbPencilCode className="footer-brand-icon" />
                                    CoWrite
                                </div>
                                <p className="footer-description">
                                    Empowering writers with AI-powered tools and vibrant communities. 
                                    Where ideas come together and stories begin.
                                </p>
                                <div className="social-links">
                                    <a href="https://github.com" className="social-link" target="_blank" rel="noopener noreferrer">
                                        <FaGithub />
                                    </a>
                                    <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
                                        <FaTwitter />
                                    </a>
                                    <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">
                                        <FaLinkedin />
                                    </a>
                                </div>
                            </div>
                            
                            <div className="footer-section">
                                <h4>Platform</h4>
                                <ul>
                                    <li><Link to="/explore">Explore</Link></li>
                                    <li><Link to="/create">Create Post</Link></li>
                                    <li><Link to="/components/coai/coai">AI Assistant</Link></li>
                                    <li><Link to="/profile">Profile</Link></li>
                                </ul>
                            </div>
                            
                            <div className="footer-section">
                                <h4>Communities</h4>
                                <ul>
                                    <li><a href="/explore">Technology</a></li>
                                    <li><a href="/explore">Creative Writing</a></li>
                                    <li><a href="/explore">Science & Nature</a></li>
                                    <li><a href="/explore">Lifestyle</a></li>
                                </ul>
                            </div>
                            
                            <div className="footer-section">
                                <h4>Resources</h4>
                                <ul>
                                    <li><a href="https://docs.github.com/en/get-started/writing-on-github" target="_blank" rel="noopener noreferrer">Writing Guide</a></li>
                                    <li><a href="https://blog.github.com" target="_blank" rel="noopener noreferrer">Blog</a></li>
                                    <li><a href="https://github.com/features" target="_blank" rel="noopener noreferrer">Features</a></li>
                                    <li><a href="https://docs.github.com" target="_blank" rel="noopener noreferrer">Documentation</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="footer-bottom">
                            <p>&copy; 2025 CoWrite. All rights reserved. Built with ❤️ for writers everywhere.</p>
                        </div>
                    </div>
                </footer>
    )
}
export default Footer;