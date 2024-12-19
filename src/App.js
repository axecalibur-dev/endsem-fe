import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/homepage/homepage";
import LoginPage from "./pages/login/login"; // Your login page component
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Signup from "./pages/signup/signup";
import { UserProvider } from "./context/userContext";
import SearchResults from "./pages/search/searchResults";

// Create Apollo Client instance
const client = new ApolloClient({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql/api`, // Your GraphQL endpoint
  cache: new InMemoryCache(),
});

function App() {
  return (
    // Wrap the entire app with ApolloProvider and UserProvider
    <ApolloProvider client={client}>
      <UserProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/discover" element={<SearchResults />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </ApolloProvider>
  );
}

export default App;
