import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TbPencilCode } from "react-icons/tb";
import { HiMiniSparkles } from "react-icons/hi2";
import { FaUsers, FaRocket, FaPalette, FaShieldAlt, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import "./homepage.css";
import VantaBackground from "../vantabackground/vantabackground";
import Navbar from "../navbar/navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import { auth } from '../../firebase'; // Import auth from firebase.js

function HomePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                backgroundColor: '#0a1a1d',
                color: 'white' 
            }}>
                Loading...
            </div>
        );
    }

    const getDisplayName = (user) => {
        if (user?.displayName) return user.displayName;
        if (user?.email) return user.email.split('@')[0];
        return 'User';
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <VantaBackground>
                <Navbar />
                <div className="maincontent">
                    <h1 className="homepageh1">
                        {user ? `Welcome back, ${getDisplayName(user)}!` : 'Welcome to CoWrite'}
                    </h1>
                    <p className="homepagep">Where Ideas Come Together and Stories Begin.</p>
                    
                    {!user && (
                        <div className="cta-buttons">
                            <Link to="/components/signup/signup" className="cta-button">
                                Get Started
                            </Link>
                            <Link to="/explore" className="cta-button secondary">
                                Explore Posts
                            </Link>
                        </div>
                    )}
                </div>
                
                <div className="features-section">
                    <h2 className="features-title">Why Choose CoWrite?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <HiMiniSparkles className="feature-icon" />
                            <h3>AI-Powered Writing</h3>
                            <p>Get intelligent suggestions, grammar corrections, and creative ideas with our advanced AI assistant to enhance your writing.</p>
                        </div>
                        <div className="feature-card">
                            <FaUsers className="feature-icon" />
                            <h3>Vibrant Communities</h3>
                            <p>Join diverse communities of writers, share your work, get feedback, and connect with like-minded creators.</p>
                        </div>
                        <div className="feature-card">
                            <FaRocket className="feature-icon" />
                            <h3>Easy Publishing</h3>
                            <p>Create and publish your content effortlessly with our intuitive editor and reach your audience instantly.</p>
                        </div>
                        <div className="feature-card">
                            <FaPalette className="feature-icon" />
                            <h3>Beautiful Design</h3>
                            <p>Enjoy a clean, modern interface that lets you focus on what matters most - your writing and creativity.</p>
                        </div>
                        <div className="feature-card">
                            <FaShieldAlt className="feature-icon" />
                            <h3>Secure & Private</h3>
                            <p>Your content is protected with enterprise-grade security. Write with confidence knowing your work is safe.</p>
                        </div>
                        <div className="feature-card">
                            <FaUsers className="feature-icon" />
                            <h3>Real-time Collaboration</h3>
                            <p>Work together with co-authors and editors in real-time, making collaboration seamless and productive.</p>
                        </div>
                    </div>
                    
                    <div className="cta-section">
                        <h3 className="cta-title">Ready to Start Writing?</h3>
                        <p className="cta-text">
                            Join thousands of writers who are already creating amazing content with CoWrite. 
                            Start your writing journey today!
                        </p>
                        <div className="cta-buttons">
                            {user ? (
                                <>
                                    <Link to="/create" className="cta-button">
                                        Create Your First Post
                                    </Link>
                                    <Link to="/components/coai/coai" className="cta-button secondary">
                                        Try AI Assistant
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/components/signup/signup" className="cta-button">
                                        Sign Up Free
                                    </Link>
                                    <Link to="/components/login/login" className="cta-button secondary">
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
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
                                    <li><Link to="/explore">Technology</Link></li>
                                    <li><Link to="/explore">Creative Writing</Link></li>
                                    <li><Link to="/explore">Science & Nature</Link></li>
                                    <li><Link to="/explore">Lifestyle</Link></li>
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
            </VantaBackground>
        </div>
    );
}

export default HomePage;