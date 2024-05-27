import React from "react";
import { useStudySessions } from "../../hooks/emailHooks";
import { Typography, Box, CircularProgress, Button, } from "@mui/material";

const Study = () => {
    const { studySpots, isLoading, error } = useStudySessions({ sessionId: 6 });

    const handleSendEmail = () => {
        if (studySpots && studySpots.length > 0) {
            const emailAddresses = studySpots.map(spot => spot.email).join(',');

            const sessionDetails = studySpots[0];
            const emailBody = `
                Subject: ${sessionDetails.subject}
                Title: ${sessionDetails.title}
                Description: ${sessionDetails.description}
                Date: ${new Date(sessionDetails.session_date).toLocaleString()}
                Duration: ${sessionDetails.duration} minutes
                Group Size: ${sessionDetails.group_size}
                Location: ${sessionDetails.location}
            `;
                // for auto adressing
            const mailtoLink = `mailto:${emailAddresses}?subject=${encodeURIComponent(sessionDetails.title)}&body=${encodeURIComponent(emailBody)}`;
            window.location.href = mailtoLink;
        }
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
