import React, { useState, useEffect } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import CommonUtilities from "../../utils/common";
import { useUser } from "../../context/userContext"; // Import context hook

const Utils = new CommonUtilities();

// GraphQL Mutation
const LOGIN_MUTATION = gql`
  mutation Login($identity: String!, $password: String!) {
    login(input: { identity: $identity, password: $password }) {
      message
      status
      refresh_token
      access_token
      data {
        lastName
        firstName
        id
      }
      meta
    }
  }
`;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { updateUser } = useUser(); // Get updateUser function from context
  const navigate = useNavigate(); // To navigate to different pages

  // Check if the user is already logged in
  useEffect(() => {
    // Check if user is logged in by looking at localStorage items
    const isLoggedIn =
      localStorage.getItem("access_token") &&
      localStorage.getItem("userDetails") &&
      JSON.parse(localStorage.getItem("userDetails")); // Parse and check if userDetails is not null or empty

    if (isLoggedIn) {
      navigate("/profile"); // Redirect to the profile page if the user is already logged in
    }
  }, [navigate]);

  // Apollo mutation hook
  const [login, { loading, error, data }] = useMutation(LOGIN_MUTATION);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({
        variables: {
          identity: email,
          password: password,
        },
      });
      console.log("Login successful:", data.login);

      if (data && data.login && data.login.access_token) {
        // Save authentication tokens and user details to localStorage
        Utils.save_authentication_local(
          data.login["access_token"],
          data.login["refresh_token"],
        );

        // Save user details in localStorage
        Utils.save_user_details_local({
          firstName: data.login.data[0].firstName,
          lastName: data.login.data[0].lastName,
          email: data.login.data[0].email,
          id: data.login.data[0].id,
        });

        // Update user context after successful login
        updateUser({
          firstName: data.login.data[0].firstName,
          lastName: data.login.data[0].lastName,
          email: data.login.data[0].email,
          id: data.login.data[0].id,
        });

        console.log("User context updated after login!");
        navigate("/"); // Redirect to profile page after login
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <div className="navbar-login">
        <Link to="/">
          <button className="logo">
            <i className="material-icons">arrow_back</i> Home
          </button>
        </Link>
      </div>
      <div className="login-content">
        <div className="login-form">
          <div className="label">
            Login to endsem <i className="material-icons">login</i>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              className="login-username"
              placeholder="Enter email or username"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="login-password"
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="submissions">
              <button
                type="submit"
                className="login-submit-button"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}{" "}
                <i className="material-icons">outbound</i>
              </button>
              <button
                type="reset"
                className="reset-submit-button"
                onClick={handleReset}
              >
                Reset <i className="material-icons">backspace</i>
              </button>
            </div>
          </form>
          <div className="api-response">
            {error && <p className="error-message">Error: {error.message}</p>}
            {data && (
              <p className="success-message">
                Login Successful! Redirecting you to home ->
              </p>
            )}
          </div>
          <div className="sign-up-prompt">
            Forgot password | Not a member ? <a href="/signup"> Join endsem</a>
          </div>
        </div>
      </div>
      <div className="login-image"></div>
    </div>
  );
}

export default LoginPage;
