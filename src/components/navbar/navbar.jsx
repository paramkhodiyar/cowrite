import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { MdAccountCircle } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { TbPencilCode } from "react-icons/tb";
import { HiMiniSparkles } from "react-icons/hi2";
import "./navbar.css";

function Navbar() {
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
                <a href="#services" className="nav-link">Create</a> {/* Keep as <a> if it's an anchor link */}
                <span className="separator">|</span>
                <a href="#contact" className="nav-link ai">CoAI <HiMiniSparkles className="sparkle-icon" /></a>  {/* Keep as <a> if anchor */}
                <span className="separator">|</span>
                <Link to="/components/signup/signup" className="nav-link ai">Signup</Link>
            </div>
            <div className="account-details">
                <span className="accountholder"><GiHamburgerMenu /> <MdAccountCircle /></span>
            </div>
        </nav>
    );
}

export default Navbar;
