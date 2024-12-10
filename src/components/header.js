import React from 'react';
import './header.css';  // Import Header-specific styles

const Header = () => {
    return (
        <header className="header">
            <div className="logo">endsem</div>
            <nav className="nav">
                <a className="navbar-pills" href="#">Home</a>
                <a className="navbar-pills" href="#">About</a>
                <a className="navbar-pills" href="#">Contact</a>
                <a className="navbar-pills login-signup" href="#">Login | SignUp</a>
            </nav>
        </header>
    );
};

export default Header;
