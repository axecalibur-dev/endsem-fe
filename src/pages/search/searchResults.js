import React, { useEffect, useState } from "react";
import "./searchResults.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";

function SearchResultsPage() {
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
    <div className="search-results-homepage-container">
      <div className="search-results-header">
        <div className="search-results-navbar">
          <div className="search-results-navbar-left">
            <button
              id="search-results-pill-btn-logo"
              className="search-results-logo-button"
            >
              endsem
            </button>
          </div>
          <div className="search-results-navbar-right">
            <button
              id="search-results-pill-btn"
              className="search-results-about-button"
            >
              <b>Home</b>
            </button>
            <button
              id="search-results-pill-btn"
              className="search-results-contact-button"
            >
              <b>About</b>
            </button>
            <button
              id="search-results-pill-btn-auth"
              className="search-results-auth-button"
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
                id="search-results-pill-btn-logout"
                className="search-results-logout-button"
                onClick={handleLogout}
              >
                Logout <i className="material-icons">logout</i>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="search-results-main-section">
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
      <div className="list-of-results">RESUTLs</div>
    </div>
  );
}

export default SearchResultsPage;
