import React from "react";
import { Routes, Route } from "react-router-dom";
import { Study } from "./pages";
import { Email } from "./pages";
import { Datapage } from "./pages";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Study />} />
        <Route path="/email" element={<Email />} />
        <Route path="/datapage" element={<Datapage />} />
      </Routes>
    </div>
  );
}

export default App;
