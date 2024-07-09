import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import { Study } from "./pages";
import { Email } from "./pages";
import { LandingPage } from "./pages";

import { Datapage } from "./pages";
import SignUp from "./pages/signup/signup";
import Verify from "./pages/verify/verify";
import Login from "./pages/login/login";
import Courses from "./pages/courses/courses";
import UpcomingSessions from "./pages/upcomingsessions/upcomingsessions";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/verify" element={<Verify />} />

                <Route element={<AuthOutlet fallbackPath="/login" />}>
                    <Route path="/study" element={<Study />} />
                    <Route path="/email" element={<Email />} />
                    <Route path="/datapage" element={<Datapage />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route
                        path="/upcomingsessions"
                        element={<UpcomingSessions />}
                    />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
