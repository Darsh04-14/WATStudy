import React from "react";
import { useStudySessions } from "../../hooks/emailHooks";
import { Typography, Box, CircularProgress, Button, } from "@mui/material";

const Study = () => {
    const { studySpots, isLoading, error } = useStudySessions({ sessionId: 6 });

    const handleSendEmail = () => {

    };

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography>Error loading session details.</Typography>;
    }

    return (
        <Box>
            {studySpots && (
                <Box>

                    <Button variant="contained" color="primary" onClick={handleSendEmail}>
                        Send Email
                    </Button>

                </Box>
            )}
        </Box>
    );
};

export default Study;
