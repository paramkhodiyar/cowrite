import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdAccountCircle } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { TbPencilCode } from "react-icons/tb";
import { HiMiniSparkles } from "react-icons/hi2";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; 
import { auth } from '../../firebase';
import "./navbar.css";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

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
            })
            .catch((error) => {
                console.error("Error logging out: ", error);
            });
    };

    return (
        <nav className="nav-bar">
            <div className="logo">
                <TbPencilCode style={{ fontSize: "30px" }} /> CoWrite
            </div>
            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                <span className="separator">|</span>
                <Link to="/components/explorepage/explorepage" className="nav-link">Explore</Link>
                <span className="separator">|</span>
                <a href="#" className="nav-link">Create</a>
                <span className="separator">|</span>
                <Link to="/components/coai/coai" className="nav-link ai">CoAI <HiMiniSparkles className="sparkle-icon" /></Link>
            </div>
            <div className="account-details">
                {!isLoggedIn ? (
                    <Link to="/components/signup/signup">
                        <button className="navbar-signup">Sign Up</button>
                    </Link>
                ) : (
                    <div className="logged-in">
                        <span className="accountholder">
                            <MdAccountCircle /> <GiHamburgerMenu />
                        </span>
                        <button className="logout-button" onClick={handleLogout}>Log Out</button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
