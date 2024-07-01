import React from "react";
import { Routes, Route } from "react-router-dom";
import { Study } from "./pages";
import { Email } from "./pages";
import { LandingPage }from "./pages";

import { Datapage } from "./pages";
import SignUp from "./pages/signup/signup";
import Verify from "./pages/verify/verify";
import Login from "./pages/login/login";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/study" element={<Study />} />
                <Route path="/email" element={<Email />} />
                <Route path="/datapage" element={<Datapage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
}

export default App;
