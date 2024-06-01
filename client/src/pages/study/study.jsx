import React, { useState } from "react";
import { useStudySessions } from "../../hooks/studyHooks";
import { Box, CircularProgress, Button, TextField } from "@mui/material";
import SessionCard from "../../components/sessionCard/sessionCard";
import SessionModal from "../../components/sessionModal/sessionModal";

const Study = () => {
    const [filter, setFilter] = useState({search: ''});
    const { studySpots, isLoading } = useStudySessions(filter);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box>
            <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
                onChange={(e) => setFilter({...filter, search: e.target.value})}
            />
            <Box sx={{ display: "flex", width: "100vw", marginBottom: "2vh" }}>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    studySpots?.map((session, idx) => (
                        <SessionCard key={idx} studySession={session} />
                    ))
                )}
            </Box>
            <Button variant="contained" onClick={handleOpen}>
                Make Post
            </Button>
            <SessionModal open={open} handleClose={handleClose} />
        </Box>
    );
};

export default Study;
