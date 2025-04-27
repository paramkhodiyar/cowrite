import "./navbar.css"
function Navbar() {
    return (
        <nav className="nav-bar">
            <div className="logo">
                Logo
            </div>


            <div className="nav-links">
                <a href="#home" className="nav-link">Home</a>
                <span className="separator">|</span>
                <a href="#about" className="nav-link">Explore</a>
                <span className="separator">|</span>
                <a href="#services" className="nav-link">Create</a>
                <span className="separator">|</span>
                <a href="#contact" className="nav-link">Account</a>
            </div>

            {/* Account Details */}
            <div className="account-details">
                <span>Account</span>
            </div>
        </nav>
    );
}
export default Navbar;