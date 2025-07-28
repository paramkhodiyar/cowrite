import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdAccountCircle } from "react-icons/md";
import { GiHamburgerMenu, GiCancel } from "react-icons/gi";
import { TbPencilCode } from "react-icons/tb";
import { HiMiniSparkles } from "react-icons/hi2";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; 
import { auth } from '../../firebase';
import "./navbar.css";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setIsLoggedIn(false);
                setUser(null);
                setMobileMenuOpen(false);
            })
            .catch((error) => {
                console.error("Error logging out: ", error);
            });
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav className="nav-bar">
            <div className="logo">
                <TbPencilCode style={{ fontSize: "30px" }} /> CoWrite
            </div>
            
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <GiCancel /> : <GiHamburgerMenu />}
            </button>
            
            <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
                <span className="separator">|</span>
                <Link to="/explore" className="nav-link" onClick={closeMobileMenu}>Explore</Link>
                <span className="separator">|</span>
                <Link to="/create" className="nav-link" onClick={closeMobileMenu}>Create</Link>
                <span className="separator">|</span>
                <Link to="/components/coai/coai" className="nav-link ai" onClick={closeMobileMenu}>
                    CoAI <HiMiniSparkles className="sparkle-icon" />
                </Link>
            </div>
            
            <div className="account-details">
                {!isLoggedIn ? (
                    <Link to="/components/signup/signup">
                        <button className="navbar-signup">Sign Up</button>
                    </Link>
                ) : (
                    <div className="logged-in">
                        <Link to="/profile" className="accountholder" onClick={closeMobileMenu}>
                            <MdAccountCircle /> <GiHamburgerMenu />
                        </Link>
                        <button className="logout-button" onClick={handleLogout}>Log Out</button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
