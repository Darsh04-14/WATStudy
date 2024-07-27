import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, ThemeProvider, createTheme } from "@mui/material";
import { styled } from "@mui/system";
import AppAppBar from '../landingPage/components/AppAppBar';
import getLPTheme from "../landingPage/getLPTheme";
import UpcomingCard from "../../components/upcomingCard/upcomingCard";

const FullPageContainer = styled(Box)({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    padding: '20px',
});

const Header = styled(Box)({
    backgroundColor: '#F4BB00',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const SessionsContainer = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
});

const axiosInstance = axios.create({
    withCredentials: true, // Ensure credentials are sent with every request
});

const UpcomingSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mode, setMode] = useState('dark');
    const LPtheme = createTheme(getLPTheme(mode));

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") ?? "{}");
        axiosInstance
            .get("http://localhost:3800/upcomingsessions", {
                params: { userId: user.uid },
            })
            .then((response) => {
                setSessions(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const handleJoinSession = (sessionId) => {
        console.log(`Joining session with ID: ${sessionId}`);
        // Implement join session logic here
    };

    const handleDeleteSession = (sessionId) => {
        console.log(`Deleting session with ID: ${sessionId}`);
        // Implement delete session logic here
    };

    if (loading) return (
        <ThemeProvider theme={LPtheme}>
            <AppAppBar mode={mode} />
            <FullPageContainer>
                <CircularProgress color="secondary" />
            </FullPageContainer>
        </ThemeProvider>
    );
    if (error) return (
        <ThemeProvider theme={LPtheme}>
            <AppAppBar mode={mode} />
            <FullPageContainer>
                <Typography variant="h6" color="error">Error: {error}</Typography>
            </FullPageContainer>
        </ThemeProvider>
    );

    return (
        <ThemeProvider theme={LPtheme}>
            <AppAppBar mode={mode} />
            <FullPageContainer>
                <Header>
                    <Typography variant="h3" component="h1">
                        Upcoming Sessions
                    </Typography>
                </Header>
                <SessionsContainer>
                    {sessions.map((session) => (
                        <UpcomingCard
                            key={session.sessionId}
                            studySession={session}
                            onJoin={handleJoinSession}
                            onDelete={handleDeleteSession}
                        />
                    ))}
                </SessionsContainer>
            </FullPageContainer>
        </ThemeProvider>
    );
};

export default UpcomingSessions;
