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
                <a href="#" className="nav-link">Create</a>
                <span className="separator">|</span>
                <Link to="/components/coai/coai" className="nav-link ai">CoAI <HiMiniSparkles className="sparkle-icon" /></Link>
                {/* <span className="separator">|</span> */}
                {/* <Link to="/components/signup/signup">Signup</Link> */}
            </div>
            <div className="account-details">
            <Link to="/components/signup/signup"><span className="accountholder"><GiHamburgerMenu /> <MdAccountCircle /></span></Link>
            </div>
        </nav>
    );
}

export default Navbar;
