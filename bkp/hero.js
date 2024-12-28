import React, { useState } from "react";
import "./hero.css"; // Import Hero-specific styles

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query

  // Handle input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value); // Update the search query on input change
  };

  // Function to make a POST request
  const fetchResults = async (searchQuery) => {
    try {
      console.log("Making API call with first_name:", searchQuery); // Log search query to console

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL_REST}/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.REACT_APP_PERMA_ACCESS_TOKEN,
          },
          body: JSON.stringify({ first_name: searchQuery }), // Pass search query as first_name in the body
        },
      );

      // Check if response is okay
      if (!response.ok) {
        console.error("API call failed:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("API Response:", data); // Log data from API response
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (searchQuery) {
      console.log("Search button clicked, query:", searchQuery); // Log when button is clicked
      fetchResults(searchQuery); // Call API if there's a query
    } else {
      console.log("Search query is empty"); // Log if the query is empty
    }
  };

  return (
    <main className="hero">
      <div className="hero-title">endsem</div>{" "}
      {/* Add this line to display the text */}
      <div className="search-container">
        <input
          className="search-input-bar"
          placeholder="Find your tribe"
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button className="search-button" onClick={handleSearchClick}>
          <i className="fa fa-search"></i>
        </button>
      </div>
      <br></br>
      <div className="subtext">
        Want to help build endsem ? Drop a 👋 at jai@endsem.com
      </div>
    </main>
  );
};

export default Hero;
