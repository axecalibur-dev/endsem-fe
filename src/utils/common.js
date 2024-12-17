class CommonUtilities {
  // Save authentication tokens in localStorage
  save_authentication_local = (access, refresh) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    return true;
  };

  // Save user details in localStorage
  save_user_details_local = (userDetails) => {
    localStorage.setItem("user_details", JSON.stringify(userDetails));
  };

  // Get user details from localStorage
  get_user_details_local = () => {
    const userDetails = localStorage.getItem("user_details");
    return userDetails ? JSON.parse(userDetails) : null;
  };

  // Remove user details and authentication tokens from localStorage (logout)
  remove_user_data_local = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_details");
  };
}

export default CommonUtilities;
