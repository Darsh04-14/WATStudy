import React, { useState, useEffect } from "react";
import { useStudySessions } from "../../hooks/emailHooks";
import { Typography, Box, CircularProgress, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, CardActions } from "@mui/material";

const Study = () => {
    const initialUserId = JSON.parse(localStorage.getItem('user') ?? '{}')?.uid || '';
    const [userId, setUserId] = useState(initialUserId);
    const [open, setOpen] = useState(!initialUserId);

    const { studySpots, isLoading, error } = useStudySessions(userId);

    useEffect(() => {
        if (initialUserId) {
            setOpen(false);
        }
    }, [initialUserId]);

    const handleClose = () => {
        if (userId) {
            console.log("Entered User ID:", userId);
            localStorage.setItem('user', JSON.stringify({ uid: userId }));
            setOpen(false);
        } else {
            alert("User ID is required to proceed.");
        }
    };

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
            const mailtoLink = `mailto:${emailAddresses}?subject=${encodeURIComponent(sessionDetails.title)}&body=${encodeURIComponent(emailBody)}`;
            window.location.href = mailtoLink;
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Enter User ID</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="userId"
                        label="User ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {isLoading ? <CircularProgress /> : error ? <Typography color="error">{error.message}</Typography> : (
                studySpots && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Session Details</Typography>
                            <Typography variant="body1"><strong>Subject:</strong> {studySpots[0].subject}</Typography>
                            <Typography variant="body1"><strong>Title:</strong> {studySpots[0].title}</Typography>
                            <Typography variant="body1"><strong>Description:</strong> {studySpots[0].description}</Typography>
                            <Typography variant="body1"><strong>Date:</strong> {new Date(studySpots[0].session_date).toLocaleString()}</Typography>
                            <Typography variant="body1"><strong>Duration:</strong> {studySpots[0].duration} minutes</Typography>
                            <Typography variant="body1"><strong>Group Size:</strong> {studySpots[0].group_size}</Typography>
                            <Typography variant="body1"><strong>Location:</strong> {studySpots[0].location}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" color="primary" onClick={handleSendEmail}>
                                Send Email
                            </Button>
                        </CardActions>
                    </Card>
                )
            )}
        </Box>
    );
};

export default Study;
