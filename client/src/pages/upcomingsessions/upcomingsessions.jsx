import React, { useEffect, useState } from "react";
import axios from "axios";
import "./upcomingsessions.css";

const axiosInstance = axios.create({
    withCredentials: true, // Ensure credentials are sent with every request
});

const UpcomingSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") ?? "{}");
        axiosInstance
            .get("http://localhost:3800/upcomingsessions", {
                params: { userId: user.uid },
            })
            .then((response) => {
                console.log(response);
                setSessions(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container">
            <header className="header">
                <h1>Upcoming Sessions</h1>
            </header>
            <div className="sessions-container">
                {sessions.map(session => (
                    <div key={session.sessionId} className="session-card">
                        <h2>{session.title}</h2>
                        <p><strong>Subject:</strong> {session.subject}</p>
                        <p><strong>Description:</strong> {session.description}</p>
                        <p><strong>Date:</strong> {new Date(session.session_date).toLocaleString()}</p>
                        <p><strong>Duration:</strong> {session.duration} minutes</p>
                        <p><strong>Group Size:</strong> {session.group_size}</p>
                        <p><strong>Location:</strong> {session.location}</p>
                        <p><strong>Friends Participating:</strong> {session.friends_participating_names}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingSessions;
