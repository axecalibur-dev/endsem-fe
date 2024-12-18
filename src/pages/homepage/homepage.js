import React, { useEffect, useState } from "react";
import "./homepage.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";

function Homepage() {
  const { userDetails: contextUserDetails, updateUser } = useUser(); // Get user details and updateUser from context
  const [userDetails, setUserDetails] = useState(contextUserDetails); // Local state to manage user details
  const [inputValue, setInputValue] = useState(""); // State for the input value
  const navigate = useNavigate(); // To navigate to different pages

  // Check if user is logged in (using context first, fallback to localStorage)
  useEffect(() => {
    if (!contextUserDetails) {
      const savedUserDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (savedUserDetails) {
        setUserDetails(savedUserDetails);
      }
    }
  }, [contextUserDetails]);

  // Check if user is logged in and get their firstName
  const isLoggedIn = userDetails && userDetails.firstName;

  // Placeholder text logic
  const placeholderText = userDetails?.firstName
    ? `Find your tribe, ${userDetails.firstName} !`
    : "Find your tribe !";

  // Handle login button click
  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  // Logout functionality
  const handleLogout = async () => {
    try {
      // Make API call to logout
      const token = localStorage.getItem("access_token");
      await fetch("https://apis.endsem.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          query: `query {
            log_out {
              message
              status
            }
          }`,
        }),
      });

      // Clear user details and tokens from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("userDetails");

      // Reset user context by updating it with an empty object or initial state
      updateUser({});

      console.log("Logged out successfully!");

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Handle API call on search button click
  const handleApiCall = async () => {
    try {
      const payload = { first_name: inputValue };
      const response = await fetch("https://apis.endsem.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("API call successful");
      } else {
        console.error("API call failed");
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

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
                  ? `Namaste, ${userDetails.firstName}`
                  : "Login | Join a tribe"}
              </b>
              <i className="material-icons">
                {isLoggedIn ? "favorite" : "login"}
              </i>
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
          <input
            className="input-area"
            placeholder={placeholderText}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // Update inputValue on change
          />
          <button
            type="submit"
            className="submit-button"
            onClick={handleApiCall} // Call API on button click
          >
            <i className="material-icons">search</i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
