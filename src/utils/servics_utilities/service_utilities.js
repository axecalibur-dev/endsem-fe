import { useUser } from "../../context/userContext";

class ServiceUtilities {
  clean_local_storage = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userDetails");

    return true;
  };
}

export default ServiceUtilities;
