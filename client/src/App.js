import React from "react";
import { Routes, Route } from "react-router-dom";
import { Study } from "./pages";
import { Email } from "./pages";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Study />} />
        <Route path="/email" element={<Email />} />
      </Routes>
    </div>
  );
}

export default App;
