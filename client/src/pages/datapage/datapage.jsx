import React, { useEffect, useState } from "react";
import { useStudySessions } from "../../hooks/datapageHooks";
import { Card, CardContent, Button, Typography, Box } from "@mui/material";

const Datapage = () => {
    const [userId, setUserId] = useState(null);
    const [view, setView] = useState(null);

    useEffect(() => {
        const id = JSON.parse(localStorage.getItem('user') ?? '{}')?.uid;
        if (id) {
            setUserId(id);
        } else {
            alert("User ID is required to view the page.");
        }
    }, []);

    const {
        studySpots,
        studySpotsError,
        isStudySpotsLoading,
        topStudySpot,
        topStudySpotError,
        isTopStudySpotLoading,
        topCourse,
        topCourseError,
        isTopCourseLoading,
        top5users,
        top5usersError,
        istop5usersLoading
    } = useStudySessions(userId);

    useEffect(() => {
        if (studySpotsError) {
            console.error('Error:', studySpotsError);
            alert("Error fetching user data: " + studySpotsError.message);
        } else if (studySpots) {
            console.log('Total Hour Details:', studySpots);
        }
    }, [studySpots, studySpotsError]);

    useEffect(() => {
        if (topStudySpotError) {
            console.error('Error:', topStudySpotError);
            alert("Error fetching top study spot: " + topStudySpotError.message);
        } else if (topStudySpot) {
            console.log('Top Study Spot:', topStudySpot);
        }
    }, [topStudySpot, topStudySpotError]);

    useEffect(() => {
        if (topCourseError) {
            console.error('Error:', topCourseError);
            alert("Error fetching top course: " + topCourseError.message);
        } else if (topCourse) {
            console.log('Top Course Details:', topCourse);
        }
    }, [topCourse, topCourseError]);

    useEffect(() => {
        if (top5usersError) {
            console.error('Error:', top5usersError);
        } else if (top5users) {
            console.log('Top 5 Users:', top5users);
        }
    }, [top5users, top5usersError]);

    if (!userId) return <div>User ID is required</div>;
    if (isStudySpotsLoading || isTopStudySpotLoading || istop5usersLoading || isTopCourseLoading) return <div>Loading...</div>;

    return (
        <Box>
            <Typography variant="h4">Hi, this is the data analytics page:</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total Hours Studied</Typography>
                        <Button variant="contained" onClick={() => setView('hours')}>
                            View Details
                        </Button>
                        {view === 'hours' && (
                            <Typography variant="body2">Total Hours: {studySpots?.total_hours}</Typography>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Top Study Spot</Typography>
                        <Button variant="contained" onClick={() => setView('studySpot')}>
                            View Details
                        </Button>
                        {view === 'studySpot' && (
                            <>
                                <Typography variant="body2">Location: {topStudySpot?.location}</Typography>
                                <Typography variant="body2">Time Spent: {topStudySpot?.max_duration} Hours</Typography>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Top Course</Typography>
                        <Button variant="contained" onClick={() => setView('course')}>
                            View Details
                        </Button>
                        {view === 'course' && (
                            <>
                                <Typography variant="body2">Subject: {topCourse?.subject}</Typography>
                                <Typography variant="body2">Time Spent: {topCourse?.total_hours} Hours</Typography>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Top 5 Users</Typography>
                        <Button variant="contained" onClick={() => setView('users')}>
                            View Details
                        </Button>
                        {view === 'users' && top5users && (
                            <Box>
                                {top5users.map((user, index) => (
                                    <Typography key={index} variant="body2">{user.name}: {user.avgrating}</Typography>
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Datapage;
