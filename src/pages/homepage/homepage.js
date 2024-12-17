import React, { useEffect, useState } from "react";
import "./homepage.css";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext"; // Assuming you have this context to get user details

function Homepage() {
  const { userDetails: contextUserDetails, updateUser } = useUser(); // Get user details and updateUser from context
  const [userDetails, setUserDetails] = useState(contextUserDetails); // Local state to manage user details
  const navigate = useNavigate(); // To navigate to different pages

  // Check if user is logged in (using context first, fallback to localStorage)
  useEffect(() => {
    if (!contextUserDetails) {
      // If userDetails is not available in context, try fetching from localStorage
      const savedUserDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (savedUserDetails) {
        setUserDetails(savedUserDetails);
      }
    }
  }, [contextUserDetails]); // Run this only when contextUserDetails change

  // Check if user is logged in and get their firstName
  const isLoggedIn = userDetails && userDetails.firstName;

  // Handle button click (redirect to profile if logged in, otherwise login)
  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      // Redirect to the user's profile if logged in
      navigate("/profile");
    } else {
      // Redirect to login page if not logged in
      navigate("/login");
    }
  };

  // Logout functionality
  const handleLogout = () => {
    // Clear user details and tokens from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userDetails");

    // Reset user context by updating it with an empty object or initial state
    updateUser({});

    console.log("Logged out successfully!");

    // Refresh the page
    window.location.reload();

    // Redirect to login page after page reload
  };
  const placeholderText = userDetails?.firstName
    ? `Find your tribe, ${userDetails.firstName} !`
    : "Find your tribe !";
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
            <button id="pill-btn" className="about-button">
              <b>About</b>
            </button>
            <button id="pill-btn" className="contact-button">
              <b>Contact</b>
            </button>
            <button
              id="pill-btn-auth"
              className="auth-button"
              onClick={handleAuthButtonClick}
            >
              <b>
                {isLoggedIn
                  ? `Salut, ${userDetails.firstName}`
                  : "Login | Join a tribe"}
              </b>
              <i className="material-icons">{isLoggedIn ? "bolt" : "login"}</i>
            </button>
            {isLoggedIn && (
              <button
                id="pill-btn-logout"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout <i className="material-icons">logout</i>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="main">
        <div className="heading">
          <b>endsem</b>
        </div>
        <div className="input-box">
          <input className="input-area" placeholder={placeholderText} />
          <button type="submit" className="submit-button">
            <i className="material-icons">search</i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
