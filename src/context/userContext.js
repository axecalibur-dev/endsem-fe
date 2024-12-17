import React, { createContext, useState, useContext, useEffect } from "react";

// Create a context for the user
const UserContext = createContext();

// Create a custom hook to use the user context
export const useUser = () => {
  return useContext(UserContext);
};

// UserProvider component
export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(() => {
    // Load user data from localStorage if available
    const savedUserDetails = localStorage.getItem("userDetails");
    return savedUserDetails ? JSON.parse(savedUserDetails) : null;
  });

  const updateUser = (user) => {
    setUserDetails(user);
    // Store updated user details in localStorage
    localStorage.setItem("userDetails", JSON.stringify(user));
  };

  const clearUser = () => {
    setUserDetails(null);
    localStorage.removeItem("userDetails");
  };

  return (
    <UserContext.Provider value={{ userDetails, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
