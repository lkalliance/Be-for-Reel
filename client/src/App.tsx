import React from "react";
import "./App.css";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";

import { Home, Profile, Poll, Create, Directory } from "./pages";
import { Header } from "./components";
import { samplePolls } from "./utils/fakedata";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        {/* defaulting to the "About" tab */}
        <Route path="/" element={<Home polls={samplePolls} />} />
        {/* <Route index element={<Navigate to="/" />} /> */}

        <Route path="/poll/:pollId" element={<Poll />} />
        <Route path="/user/:userId" element={<Profile />} />
        <Route path="/create" element={<Create />} />
        <Route path="/polls" element={<Directory />} />
        <Route path="*" element={<Home polls={samplePolls} />} />
      </Routes>
    </div>
  );
}

export default App;
