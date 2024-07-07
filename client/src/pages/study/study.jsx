import React, { useState } from "react";
import { useDeleteSession, useStudySessions } from "../../hooks/studyHooks";
import { Box, CircularProgress, Button, TextField } from "@mui/material";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import SessionCard from "../../components/sessionCard/sessionCard";
import SessionModal from "../../components/sessionModal/sessionModal";

const Study = () => {
    const [filter, setFilter] = useState({ search: "" });
    const { studySpots, isLoading } = useStudySessions(filter);
    const { deleteSession } = useDeleteSession();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSearch = (e) => setFilter({ ...filter, search: e.target.value });

    const debounceSearch = _.debounce(handleSearch, 300);

    return (
        <Box>
            <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
                onChange={debounceSearch}
            />
            <Box
                sx={{
                    display: "flex",
                    width: "100vw",
                    marginBottom: "2vh",
                    flexWrap: "row",
                }}
            >
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    studySpots?.map((session, idx) => (
                        <Box key={idx}>
                            <SessionCard studySession={session} />
                            <Button
                                variant="contained"
                                onClick={() => deleteSession(session.id)}
                            >
                                Delete Session
                            </Button>
                        </Box>
                    ))
                )}
            </Box>
            <Button variant="contained" onClick={handleOpen}>
                Make Post
            </Button>
            <SessionModal open={open} handleClose={handleClose} />
            <Box sx={{ marginTop: "2vh", display: "flex", gap: "1vw" }}>
                <Button variant="contained" onClick={() => navigate("/email")}>
                    Email Notifier
                </Button>
                <Button variant="contained" onClick={() => navigate("/datapage")}>
                    Data Analytics Page
                </Button>
                <Button variant="contained" onClick={() => navigate("/courses")}>
                    Suggested Courses
                </Button>
            </Box>
        </Box>
    );
};

export default Study;
