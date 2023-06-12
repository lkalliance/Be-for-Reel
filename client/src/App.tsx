import React from "react";
import "./App.css";
import { Home, Profile, Poll, Create, Directory } from "./pages";

function App() {
  return (
    <div className="App">
      <Home />
      <Poll />
      <Create />
      <Profile />
      <Directory />
    </div>
  );
}

export default App;
