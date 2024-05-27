import React from "react";
import { useStudySessions } from "../../hooks/studyHooks";
import { Box, CircularProgress, Button } from "@mui/material";
import SessionCard from "../../components/sessionCard/sessionCard";
import SessionModal from "../../components/sessionModal/sessionModal";

const Study = () => {
    const { studySpots, isLoading } = useStudySessions();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box>
            {isLoading ? (
                <CircularProgress />
            ) : (
                studySpots?.map((session, idx) => (
                    <SessionCard key={idx} studySession={session} />
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
