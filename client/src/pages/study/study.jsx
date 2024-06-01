import React, { useState } from "react";
import { useStudySessions } from "../../hooks/studyHooks";
import { Box, CircularProgress, Button } from "@mui/material";
import SessionCard from "../../components/sessionCard/sessionCard";
import SessionModal from "../../components/sessionModal/sessionModal";
import axios from "axios";

const Study = () => {
    const { studySpots, isLoading } = useStudySessions();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDeleteSession = (sessionId) => { //outside hook
        axios.delete(`http://localhost:3800/studysession`, {
            data: { id: sessionId }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error deleting this:', error);
            });
    };

    return (
        <Box>
            {isLoading ? (
                <CircularProgress />
            ) : (
                studySpots?.map((session, idx) => (
                    <Box key={idx}>
                        <SessionCard studySession={session} />
                        <Button variant="contained" onClick={() => handleDeleteSession(session.id)}>
                            Delete Session
                        </Button>
                    </Box>
                ))
            )}
            <Button variant="contained" onClick={handleOpen}>
                Make Post
            </Button>
            <SessionModal open={open} handleClose={handleClose} />
        </Box>
    );
};

export default Study;
