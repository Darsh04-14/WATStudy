import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const SessionCard = ({ studySession, onDelete, onJoin }) => {
    return (
        <Card sx={{ marginBottom: 2, padding: 2, width: 300,  bgcolor: 'black',
            boxShadow: '0 0 10px 1px #F4BB00',
            p: 4, }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {studySession.subject}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {studySession.courseNumber} - {studySession.title}

                </Typography>
                <Typography variant="body2">
                    {studySession.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Date: {studySession.session_date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Duration: {studySession.duration} hours
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Location: {studySession.location}
                </Typography>
                <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="secondary" onClick={() => onDelete(studySession.id)}>
                        Delete
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => onJoin(studySession.id)}>
                        Join
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SessionCard;
