import React from "react";
import './homepage.css';
import {Link} from "react-router-dom";

function Homepage() {
    return (
        <div className="homepage-container">
            <div className="header">
                <div className="navbar">
                    <div className="navbar-left">
                        <button id="pill-btn-logo" className="logo-button">
                            endsem
                        </button>
                    </div>
                    <div className="navbar-right">
                        <button id="pill-btn" className="home-button">
                            <b>Home</b>
                        </button>
                        <button id="pill-btn" className="about-button">
                            <b>About</b>
                        </button>
                        <button id="pill-btn" className="contact-button">
                             <b>Contact</b>
                        </button>
                        <Link to="/login">
                        <button id="pill-btn-auth" className="auth-button">
                            <b>Login | Join a tribe</b><i className='material-icons'>login</i>
                        </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="main">
                <div className="heading">
                    <b>endsem</b>
                </div>
                <div className="input-box">
                    <input className="input-area" placeholder="Find your tribe" />
                    <button type="submit" className="submit-button"><i className='material-icons'>search</i> </button>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
