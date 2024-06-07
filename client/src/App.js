import React from "react";
import { Routes, Route } from "react-router-dom";
import { Study } from "./pages";
import { Email } from "./pages";
import { LandingPage }from "./pages";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/email" element={<Email />} />
        <Route path="/study" element={<Study />} />
      </Routes>
    </div>
  );
}

export default App;
