import React, { useEffect, useState } from "react";
import "./searchResults.css";
import { Link, useNavigate } from "react-router-dom";
import profileImage from "./profile.png";
import ServiceUtilities from "../../utils/servics_utilities/service_utilities";
import { useUser } from "../../context/userContext";
const Service = new ServiceUtilities();

function SearchResultsPage() {
  const [userDetails, setUserDetails] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]); // Track followed users
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [loginMessage, setLoginMessage] = useState(""); // Track login message
  const navigate = useNavigate();
  const { userDetails: contextUserDetails, updateUser } = useUser();
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const savedUserDetails = JSON.parse(localStorage.getItem("userDetails"));

    if (accessToken && savedUserDetails) {
      setUserDetails(savedUserDetails);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const placeholderText = userDetails?.firstName
    ? `Find your tribe, ${userDetails.firstName} !`
    : "Find your tribe !";

  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch("https://apis.endsem.com/graphql/api", {
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

      await Service.clean_local_storage();

      updateUser({});
      console.log("POP");
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleApiCall = async () => {
    try {
      const payload = { first_name: inputValue };
      const accessToken = localStorage.getItem("access_token"); // Get token from localStorage
      const headers = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `${accessToken}`; // Add Authorization header if logged in
      }

      const response = await fetch("https://apis.endsem.com/search", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(Array.isArray(data.result) ? data.result : []);
        console.log("API call successful");
      } else {
        console.error("API call failed");
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handleFollow = async (userId) => {
    if (!isLoggedIn) {
      // Prevent the follow button from being clicked
      setLoginMessage("You are not logged in. Please log in to follow users.");
      return; // Prevent API call
    }

    setLoginMessage(""); // Clear the login message if logged in

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("https://apis.endsem.com/graphql/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          query: `mutation {
            follow_someone(input: {
              now_following_id: "${userId}"
            }) {
              message
              status
              meta
            }
          }`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Follow API response:", data);

        // Check if the message in the response indicates a successful follow
        if (
          data?.data?.follow_someone?.message ===
          "You are now following this person."
        ) {
          setFollowingUsers((prev) => [...prev, userId]);
        }
      } else {
        console.error("Follow API call failed");
      }
    } catch (error) {
      console.error("Error during follow API call:", error);
    }
  };

  return (
    <div className="search-results-homepage-container">
      <div className="search-results-header">
        <div className="search-results-navbar">
          <div className="search-results-navbar-left">
            <Link to="/">
              <button
                id="search-results-pill-btn-logo"
                className="search-results-logo-button"
              >
                endsem
              </button>
            </Link>
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
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="search-submit-button"
            onClick={handleApiCall}
          >
            <i className="material-icons">search</i>
          </button>
        </div>
      </div>

      {/* Show login message if trying to follow while not logged in */}
      {loginMessage && (
        <div className="login-message">
          <p>{loginMessage}</p>
        </div>
      )}

      <div className="list-of-results">
        <div className="list-main">
          {searchResults.length === 0 ? (
            <div className="no-results-message">
              Search for your favourite tribes or tribesmen !{" "}
            </div>
          ) : (
            searchResults.map((item, index) => (
              <div className="search-card" key={index}>
                <div className="partition-left">
                  <img src={item.profile_picture} alt="profile" />
                  <div className="info">
                    <div className="info-text">
                      {item.first_name} {item.last_name}
                    </div>
                    <div className="info-text-extra">
                      @{item.user_name} <b> | </b> Lives in Jaipur, Rajasthan
                      <b> | </b>
                      {item.university} <b> | </b> {item.discipline}
                    </div>
                  </div>
                </div>
                <div className="partition-right">
                  {/* Disable follow button if not logged in */}
                  <button
                    className={`follow-button ${isLoggedIn ? (followingUsers.includes(item.user_id) ? "following" : "") : "not-logged-in"}`}
                    onClick={() => {
                      if (!isLoggedIn) {
                        // Redirect to login page if not logged in
                        navigate("/login");
                      } else {
                        // Proceed with follow action if logged in
                        handleFollow(item.user_id);
                      }
                    }}
                    disabled={followingUsers.includes(item.user_id)} // Disable button if already following
                  >
                    {isLoggedIn
                      ? followingUsers.includes(item.user_id)
                        ? "Following"
                        : "Follow"
                      : "Login to Follow"}
                    <i className="material-icons">
                      {isLoggedIn
                        ? followingUsers.includes(item.user_id)
                          ? "check_circle" // "check" icon for "Following"
                          : "person_add" // "person_add" icon for "Follow"
                        : "login"}{" "}
                      {/* "key" icon for "Login to Follow" */}
                    </i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResultsPage;
