import React, { useEffect } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  const { updateUser } = useUser(); // Get updateUser function from context
  const navigate = useNavigate(); // To navigate to different pages

  // Apollo mutation hook
  const [login, { loading, error, data }] = useMutation(LOGIN_MUTATION);

  // Check if the user is already logged in
  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("access_token") &&
      localStorage.getItem("userDetails") &&
      JSON.parse(localStorage.getItem("userDetails"));

    if (isLoggedIn) {
      navigate("/profile"); // Redirect to the profile page
    }
  }, [navigate]);

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await login({
          variables: {
            identity: values.email,
            password: values.password,
          },
        });

        if (data && data.login && data.login.access_token) {
          // Save tokens and user details to localStorage
          Utils.save_authentication_local(
            data.login["access_token"],
            data.login["refresh_token"],
          );

          Utils.save_user_details_local({
            firstName: data.login.data[0].firstName,
            lastName: data.login.data[0].lastName,
            email: values.email,
            id: data.login.data[0].id,
          });

          // Update user context
          updateUser({
            firstName: data.login.data[0].firstName,
            lastName: data.login.data[0].lastName,
            email: values.email,
            id: data.login.data[0].id,
          });

          navigate("/"); // Redirect to home
        }
      } catch (err) {
        console.error("Login error:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-container">
      <div className="navbar-login">
        <Link to="/" className="Link-style">
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

          <form onSubmit={formik.handleSubmit}>
            <input
              className="login-username"
              placeholder="Enter email or username"
              type="text"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error-message">{formik.errors.email}</div>
            ) : null}

            <input
              className="login-password"
              placeholder="Enter password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error-message">{formik.errors.password}</div>
            ) : null}

            <div className="submissions">
              <button
                type="submit"
                className="login-submit-button"
                disabled={loading || formik.isSubmitting}
              >
                {loading || formik.isSubmitting ? "Submitting..." : "Submit"}{" "}
                <i className="material-icons">outbound</i>
              </button>
              <button
                type="reset"
                className="reset-submit-button"
                onClick={formik.handleReset}
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
            Forgot password | Not a member? <a href="/signup">Join endsem</a>
          </div>
        </div>
      </div>
      <div className="login-image"></div>
    </div>
  );
}

export default LoginPage;
