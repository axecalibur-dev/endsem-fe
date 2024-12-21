import { useUser } from "../../context/userContext";

class ServiceUtilities {
  clean_local_storage = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userDetails");
  };

  clean_user_context_post_logout = async () => {
    const { userDetails: contextUserDetails, updateUser } = useUser();
    updateUser({});
  };
}

export default ServiceUtilities;
