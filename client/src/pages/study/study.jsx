import React, { useState, useEffect } from "react";
import { useDeleteSession, useStudySessions, useJoinSession } from "../../hooks/studyHooks";
import { Box, CircularProgress, Button, TextField, Pagination, Typography } from "@mui/material";
import _ from "lodash";
import SessionCard from "../../components/sessionCard/sessionCard";
import SessionModal from "../../components/sessionModal/sessionModal";

const Study = () => {
    const [filter, setFilter] = useState({ search: "" });
    const { studySpots, isStudySpotsLoading } = useStudySessions(filter);
    const { deleteSession } = useDeleteSession();
    const { joinSession } = useJoinSession();
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const id = JSON.parse(localStorage.getItem('user') ?? '{}')?.uid;
        if (id) {
            setUserId(id);
        } else {
            alert("User ID is required to view the page.");
        }
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSearch = (e) => setFilter({ ...filter, search: e.target.value });

    const debounceSearch = _.debounce(handleSearch, 300);

    const handleJoinSession = async (sessionId) => {
        if (!userId) {
            alert('User ID is required.');
            return;
        }

        try {
            await joinSession(sessionId, userId);
            alert('Successfully joined the session!');
        } catch (error) {
            console.error('Error joining session:', error);
            alert('Failed to join the session.');
        }
    };

    const handleDeleteSession = async (sessionId) => {
        try {
            await deleteSession(sessionId);
        } catch (error) {
            console.error('Error deleting session:', error);
            alert('Failed to delete the session.');
        }
    };

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const paginatedSpots = studySpots?.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Study Sessions
            </Typography>
            <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                onChange={debounceSearch}
                sx={{ marginBottom: 2 }}
            />
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 2,
                    marginBottom: "2vh",
                }}
            >
                {isStudySpotsLoading ? (
                    <CircularProgress />
                ) : (
                    paginatedSpots?.map((session, idx) => (
                        <SessionCard
                            key={idx}
                            studySession={session}
                            onDelete={handleDeleteSession}
                            onJoin={handleJoinSession}
                        />
                    ))
                )}
            </Box>
            <Pagination
                count={Math.ceil(studySpots?.length / itemsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
                sx={{ marginTop: 2 }}
            />
            <Button variant="contained" onClick={handleOpen} sx={{ marginTop: 2 }}>
                Make Post
            </Button>
            <SessionModal open={open} handleClose={handleClose} />
        </Box>
    );
};

export default Study;
