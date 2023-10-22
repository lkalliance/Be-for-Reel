import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { AuthService } from "./utils/auth";
import { Home, Profile, Poll, Create, Directory, Login } from "./pages";
import { Header } from "./components";
import { userData, userPollProps } from "./utils/interfaces";

const httpLink = createHttpLink({ uri: "/graphql" });
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  uri: "http://:3001/graphql",
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

function App() {
  const Auth = new AuthService();
  const emptyPollList: Array<userPollProps> = [];
  const [loggedIn, setLoggedIn] = useState(Auth.loggedIn());
  const [pollList, setPollList] = useState({ polls: emptyPollList });
  const userInfo: userData = Auth.getProfile();

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Header uname={userInfo.userName} lookup={userInfo.lookupName} />
        <Routes>
          {/* defaulting to the "About" tab */}
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={
              Auth.loggedIn() ? (
                <Navigate to="/" replace={true} />
              ) : (
                <Login setLogIn={setLoggedIn} />
              )
            }
          />
          <Route path="/polls/:genre" element={<Directory />} />

          <Route
            path="/:lookupname/:pollname"
            element={<Poll loggedin={loggedIn} currUser={userInfo.userName} />}
          />
          <Route path="/:username" element={<Profile />} />
          <Route
            path="/create"
            element={
              !Auth.loggedIn() ? (
                <Navigate to="/" replace={true} />
              ) : (
                <Create updateList={setPollList} currentList={pollList} />
              )
            }
          />
          <Route path="/polls" element={<Directory />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </ApolloProvider>
  );
}

export default App;
