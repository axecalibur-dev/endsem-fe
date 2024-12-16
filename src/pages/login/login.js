import React, { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";

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
  // State hooks for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
                Login Successful ! Redirecting you to home ->
              </p>
            )}
          </div>
          <div className="sign-up-prompt">
            Forgot password | Not a member ? Join endsem
          </div>
        </div>
      </div>
      <div className="login-image"></div>
    </div>
  );
}

export default LoginPage;
