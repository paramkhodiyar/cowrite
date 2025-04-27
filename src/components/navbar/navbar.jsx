import "./navbar.css"
import { MdAccountCircle } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { TbPencilCode } from "react-icons/tb";
import { HiMiniSparkles } from "react-icons/hi2";

function Navbar() {
    return (
        <nav className="nav-bar">
            <div className="logo">
                <TbPencilCode style={{fontSize:"30px"}}/> CoWrite
            </div>
            <div className="nav-links">
                <a href="#home" className="nav-link">Home</a>
                <span className="separator">|</span>
                <a href="#about" className="nav-link">Explore</a>
                <span className="separator">|</span>
                <a href="#services" className="nav-link">Create</a>
                <span className="separator">|</span>
                <a href="#contact" className="nav-link ai">CoAI <HiMiniSparkles className="sparkle-icon" /></a>
            </div>
            <div className="account-details">
                <span className="accountholder"><GiHamburgerMenu /> <MdAccountCircle /></span>
            </div>
        </nav>
    );
}
export default Navbar;