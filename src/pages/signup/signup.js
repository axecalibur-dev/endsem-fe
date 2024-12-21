import React, { useState, useEffect } from "react";
import "./signup.css";
import { useUser } from "../../context/userContext"; // Ensure the correct import path
import { Link, useNavigate } from "react-router-dom";
import { gql } from "graphql-tag";
import { useMutation } from "@apollo/client";
import CommonUtilities from "../../utils/common";

const Utils = new CommonUtilities();

// GraphQL Mutation
const SIGNUP_MUTATION = gql`
  mutation SignUp(
    $firstName: String!
    $lastName: String!
    $password: String!
    $email: String!
    $username_handle: String!
    $university: String!
    $discipline: String!
  ) {
    sign_up(
      input: {
        firstName: $firstName
        lastName: $lastName
        password: $password
        email: $email
        username_handle: $username_handle
        university: $university
        discipline: $discipline
      }
    ) {
      message
      status
      refresh_token
      access_token
      data {
        firstName
        id
        lastName
      }
      meta
    }
  }
`;

function SignupPage() {
  const [email, setEmail] = useState("");
  // const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const [university, setUniversity] = useState("");
  const [discipline, setDiscipline] = useState("");

  const navigate = useNavigate();
  const { userDetails, updateUser } = useUser(); // Access user context
  const [sign_up, { loading, error, data }] = useMutation(SIGNUP_MUTATION);

  // Check if the user is already logged in and redirect to profile
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

  // Log userDetails when it changes
  useEffect(() => {
    if (userDetails) {
      console.log("Updated user context:", userDetails);
    }
  }, [userDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await sign_up({
        variables: {
          firstName: FirstName,
          lastName: LastName,
          password: password,
          // phone: phone.trim(),
          email: email,
          username_handle: username,
          university: university,
          discipline: discipline,
        },
      });

      if (data && data.sign_up && data.sign_up.access_token) {
        // Save authentication tokens in localStorage
        Utils.save_authentication_local(
          data.sign_up["access_token"],
          data.sign_up["refresh_token"],
        );

        // Save user details in localStorage
        Utils.save_user_details_local({
          firstName: data.sign_up.data[0].firstName,
          lastName: data.sign_up.data[0].lastName,
          id: data.sign_up.data[0].id,
        });

        // Update user context after successful login
        updateUser({
          firstName: data.sign_up.data[0].firstName,
          lastName: data.sign_up.data[0].lastName,
          email: data.sign_up.data[0].email,
          id: data.sign_up.data[0].id,
        });

        console.log("User context updated after signup!");
        navigate("/"); // Redirect to profile page after signup
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  const handleReset = () => {
    setEmail("");
    // setPhone("");
    setUsername("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setUniversity("");
    setDiscipline("");
  };

  return (
    <div className="signup-container">
      <div className="signup-navbar-login">
        <Link to="/" className="Link-style">
          <button className="logo">
            <i className="material-icons">arrow_back</i> Home
          </button>
        </Link>
      </div>
      <div className="signup-content">
        <div className="signup-form">
          <div className="signup-label">
            Join endsem <i className="material-icons">bolt</i>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              className="signup-username"
              placeholder="Enter email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="signup-username"
              placeholder="Enter first name"
              type="text"
              value={FirstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="signup-username"
              placeholder="Enter last name"
              type="text"
              value={LastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              className="signup-username"
              placeholder="Enter university name"
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
            <input
              className="signup-username"
              placeholder="Enter discipline and year"
              type="text"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
            />
            {/*<input*/}
            {/*  className="signup-username"*/}
            {/*  placeholder="Enter phone"*/}
            {/*  type="text"*/}
            {/*  value={phone}*/}
            {/*  onChange={(e) => setPhone(e.target.value)}*/}
            {/*/>*/}
            <input
              className="signup-username"
              placeholder="Select a username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="signup-password"
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="signup-submissions">
              <button
                type="submit"
                className="signup-submit-button"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}{" "}
                <i className="material-icons">outbound</i>
              </button>
              <button
                type="reset"
                className="signup-reset-button"
                onClick={handleReset}
              >
                Reset <i className="material-icons">backspace</i>
              </button>
            </div>
          </form>
          <div className="signup-api-response">
            {error && (
              <p className="signup-error-message">Error: {error.message}</p>
            )}
            {data && (
              <p className="signup-success-message">
                Welcome to endsem! Redirecting you to home ->
              </p>
            )}
          </div>
          <div className="signup-sign-up-prompt">
            Forgot password | Already a member? <a href="/login">Login</a>
          </div>
        </div>
      </div>
      <div className="signup-image"></div>
    </div>
  );
}

export default SignupPage;
