import React, { useEffect } from "react";
import "./signup.css";
import { useUser } from "../../context/userContext"; // Ensure the correct import path
import { Link, useNavigate } from "react-router-dom";
import { gql } from "graphql-tag";
import { useMutation } from "@apollo/client";
import CommonUtilities from "../../utils/common";
import { useFormik } from "formik";
import * as Yup from "yup";

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
  const navigate = useNavigate();
  const { updateUser } = useUser(); // Access user context
  const [sign_up, { loading, error, data }] = useMutation(SIGNUP_MUTATION);

  // Check if the user is already logged in and redirect to profile
  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("access_token") &&
      localStorage.getItem("userDetails");

    if (isLoggedIn) {
      navigate("/profile"); // Redirect to the profile page if the user is already logged in
    }
  }, [navigate]);

  // Formik for form state management
  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      university: "",
      discipline: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      firstName: Yup.string().min(2, "Too short").required("Required"),
      lastName: Yup.string().min(2, "Too short").required("Required"),
      username: Yup.string()
        .min(3, "Must be at least 3 characters")
        .required("Required"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("Required"),
      university: Yup.string().required("Required"),
      discipline: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await sign_up({
          variables: {
            ...values,
            username_handle: values.username,
          },
        });

        if (data && data.sign_up && data.sign_up.access_token) {
          Utils.save_authentication_local(
            data.sign_up.access_token,
            data.sign_up.refresh_token,
          );

          Utils.save_user_details_local({
            firstName: data.sign_up.data[0].firstName,
            lastName: data.sign_up.data[0].lastName,
            id: data.sign_up.data[0].id,
          });

          updateUser({
            firstName: data.sign_up.data[0].firstName,
            lastName: data.sign_up.data[0].lastName,
            email: values.email,
            id: data.sign_up.data[0].id,
          });

          navigate("/"); // Redirect to profile page
        }
      } catch (err) {
        console.error("Signup error:", err);
      }
    },
  });

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

          <form onSubmit={formik.handleSubmit}>
            <input
              className="signup-username"
              placeholder="Enter email"
              type="text"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="error-message">{formik.errors.email}</p>
            )}

            <input
              className="signup-username"
              placeholder="Enter first name"
              type="text"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="error-message">{formik.errors.firstName}</p>
            )}

            <input
              className="signup-username"
              placeholder="Enter last name"
              type="text"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="error-message">{formik.errors.lastName}</p>
            )}

            <input
              className="signup-username"
              placeholder="Enter university name"
              type="text"
              name="university"
              value={formik.values.university}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.university && formik.errors.university && (
              <p className="error-message">{formik.errors.university}</p>
            )}

            <input
              className="signup-username"
              placeholder="Enter discipline and year"
              type="text"
              name="discipline"
              value={formik.values.discipline}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.discipline && formik.errors.discipline && (
              <p className="error-message">{formik.errors.discipline}</p>
            )}

            <input
              className="signup-username"
              placeholder="Select a username"
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="error-message">{formik.errors.username}</p>
            )}

            <input
              className="signup-password"
              placeholder="Enter password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="error-message">{formik.errors.password}</p>
            )}

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
                onClick={formik.handleReset}
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
