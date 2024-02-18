import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { AuthService } from "./utils/auth";
import {
  Home,
  Profile,
  Poll,
  Create,
  Directory,
  Login,
  UserDir,
  TopMovies,
  FAQ,
  SearchResults,
} from "./pages";
import { Header, Footer } from "./pageComponents";

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
  const auth = new AuthService();
  const [loggedIn, setLoggedIn] = useState<boolean>(auth.loggedIn());
  const [aORb, setaORb] = useState<string>("a");
  const { userName } = auth.getProfile();

  return (
    <ApolloProvider client={client}>
      <div
        className={
          aORb === "a" ? "App style-a" : aORb === "b" ? "App style-b" : "App"
        }
      >
        <Header
          loggedIn={loggedIn}
          setLogIn={setLoggedIn}
          abSwitch={setaORb}
          currentSwitch={aORb}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/email/:eToken"
            element={<Login setLogIn={setLoggedIn} />}
          />
          <Route
            path="/pwd/:eToken"
            element={<Login setLogIn={setLoggedIn} />}
          />
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/" replace={true} />
              ) : (
                <Login setLogIn={setLoggedIn} />
              )
            }
          />
          <Route path="/polls/:genre" element={<Directory />} />
          <Route path="/polls" element={<Directory />} />
          <Route path="/users" element={<UserDir />} />
          <Route path="/top-films" element={<TopMovies />} />
          <Route path="/search/:term" element={<SearchResults />} />
          <Route
            path="/:lookupname/:pollname"
            element={<Poll loggedin={loggedIn} currUser={userName} />}
          />
          <Route
            path="/create"
            element={
              !loggedIn ? <Navigate to="/" replace={true} /> : <Create />
            }
          />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/Faq" element={<FAQ />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
