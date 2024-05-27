import React from "react";
import {
    Card,
    CardActions,
    CardContent,
    Typography,
    Button,
    Box,
    CardActionArea,
    Modal,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";

const SessionCard = ({ studySession }) => {
    const {
        subject,
        title,
        description,
        session_date,
        duration,
        group_size,
        creator_fk,
        location,
    } = studySession;
    
    const card = (
        <React.Fragment>
            <CardContent>
                <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                >
                    {title} @ {location}
                </Typography>
                <Typography variant="h5" component="div"></Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {subject}
                </Typography>
                <Typography variant="body2">{description}</Typography>
            </CardContent>
            <CardActions>
                <PeopleIcon />
                {group_size}
            </CardActions>
        </React.Fragment>
    );
    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined" sx={{ width: "15vw" }}>
                {card}
            </Card>
        </Box>
    );
};

export default SessionCard;
