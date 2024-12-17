import React, { useEffect, useState } from "react";
import "./homepage.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext"; // Assuming you have this context to get user details
import { gql, useApolloClient } from "@apollo/client";

function Homepage() {
  const { userDetails: contextUserDetails, updateUser } = useUser(); // Get user details and updateUser from context
  const [userDetails, setUserDetails] = useState(contextUserDetails); // Local state to manage user details
  const navigate = useNavigate(); // To navigate to different pages
  const client = useApolloClient(); // Use Apollo Client for GraphQL requests

  // GraphQL logout query
  const LOGOUT_QUERY = gql`
    query Query {
      log_out {
        message
        status
      }
    }
  `;

  // Check if user is logged in (using context first, fallback to localStorage)
  useEffect(() => {
    if (!contextUserDetails) {
      // If userDetails is not available in context, try fetching from localStorage
      const savedUserDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (savedUserDetails) {
        setUserDetails(savedUserDetails);
      }
    }
  }, [contextUserDetails]);

  // Check if user is logged in and get their firstName
  const isLoggedIn = userDetails && userDetails.firstName;

  // Handle button click (redirect to profile if logged in, otherwise login)
  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      navigate("/profile"); // Redirect to the user's profile if logged in
    } else {
      navigate("/login"); // Redirect to login page if not logged in
    }
  };

  // Logout functionality with GraphQL call
  const handleLogout = async () => {
    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        // Call the logout API with the access token
        const response = await client.query({
          query: LOGOUT_QUERY,
          context: {
            headers: {
              Authorization: `${accessToken}`,
            },
          },
        });

        if (response.data?.log_out?.status) {
          console.log("Logout successful:", response.data.log_out.message);
          console.log("Logout successful:", response.data.log_out.status);
        } else {
          console.error("Logout failed:", response.data?.log_out?.message);
        }
      }

      // Clear user details and tokens from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("userDetails");

      // Reset user context
      updateUser({});

      // Refresh the page and redirect to login
      window.location.reload();
    } catch (err) {
      console.error("Error during logout:", err);

      // Clear user details and tokens from localStorage in case of error
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("userDetails");

      // Reset user context
      updateUser({});

      // Refresh the page and redirect to login
      window.location.reload();
    }
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
