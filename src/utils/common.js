class CommonUtilities {
  save_authentication_local = (access, refresh) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    return true;
  };
}
export default CommonUtilities;
