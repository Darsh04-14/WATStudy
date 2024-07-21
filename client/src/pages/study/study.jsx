import React, { useState, useEffect } from "react";
import { useDeleteSession, useStudySessions, useJoinSession } from "../../hooks/studyHooks";
import { Box, CircularProgress, Button, TextField, Pagination, Typography, ThemeProvider, createTheme } from "@mui/material";
import _ from "lodash";
import SessionCard from "../../components/sessionCard/sessionCard";
import SessionModal from "../../components/sessionModal/sessionModal";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import AppAppBar from '../landingPage/components/AppAppBar';
import getLPTheme from "../landingPage/getLPTheme";

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






const Study = () => {
    const [mode, setMode] = React.useState('dark');
    const LPtheme = createTheme(getLPTheme(mode));

    const [filter, setFilter] = useState({ search: "" });
    const { studySpots, isStudySpotsLoading } = useStudySessions(filter);
    const { deleteSession } = useDeleteSession();
    const { joinSession } = useJoinSession();
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 9;
    const navigate = useNavigate();

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
        <ThemeProvider theme={LPtheme}>
        <AppAppBar mode={mode} />
        <FullPageContainer>
        <Box sx={{ style }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Typography variant="h3" component="h1" gutterBottom style={{ color: 'white'}}>
                    Study Sessions
                </Typography>
                
            </Box>
            <Box sx={{ display: 'flex', justifyContent:'space-between' }}>
            <Box sx={{alignItems: 'flex-start', marginLeft: '180px' }}>
            
            <TextField 
                    id="outlined-basic"
                    label=" Search"
                    variant="outlined"
                    onChange={debounceSearch}
                    sx={{ 
                        marginBottom: 2, 
                        display: "flex", 
                        flexWrap: "wrap", 
                        justifyContent: "center", 
                        textAlign: 'center', 
                        fontSize: '1.25rem',
                        padding: '8px'
                    }}

                />
            </Box>

                <Box sx={{ marginRight: '185px' }}>
                    <Button variant="contained" onClick={handleOpen} >
                        Make Post
                    </Button>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 3,
                    marginBottom: "1vh",
                    
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
                sx={{ margin: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
            />
            
            <SessionModal open={open} handleClose={handleClose} />
            
        </Box>
        </FullPageContainer>
    </ThemeProvider>
    );
};

export default Study;
