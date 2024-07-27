import React, { useState, useEffect } from "react";
import { useStudySessions } from "../../hooks/emailHooks";
import { Typography, Box, CircularProgress, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, CardActions, ThemeProvider, createTheme } from "@mui/material";
import AppAppBar from '../landingPage/components/AppAppBar';
import getLPTheme from "../landingPage/getLPTheme";
import { styled } from "@mui/system";


const FullPageContainer = styled(Box)({
    minHeight: '100vh', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black', 
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'black',
    boxShadow: '0 0 35px 10px #F4BB00',
    padding: 3,
    color: 'white'
  };
    
const inputStyle = {
textAlign: 'center', 
fontSize: '1.25rem',
padding: '8px'
};

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};


const Email = () => {

    const [mode, setMode] = React.useState('dark');
    const LPtheme = createTheme(getLPTheme(mode));
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
        <ThemeProvider theme={LPtheme}>
        <AppAppBar mode={mode} />
        <FullPageContainer>
        <Box sx={{ style }}>
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
                    <Card sx={style}>
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
        </FullPageContainer>
        </ThemeProvider>
    );
};

export default Email;
