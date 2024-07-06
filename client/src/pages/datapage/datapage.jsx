import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Grid, Button } from "@mui/material";
import { useStudySessions } from "../../hooks/datapageHooks";

const Datapage = () => {
    const [userId, setUserId] = useState(null);
    const [showStudySpots, setShowStudySpots] = useState(false);
    const [showTopStudySpot, setShowTopStudySpot] = useState(false);
    const [showTopCourse, setShowTopCourse] = useState(false);
    const [showTop5Users, setShowTop5Users] = useState(false);

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
        <div>
            <Typography variant="h4" gutterBottom>Data Analytics Page</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Hours Studied</Typography>
                            <Button variant="contained" onClick={() => setShowStudySpots(!showStudySpots)}>
                                {showStudySpots ? 'Hide' : 'View'}
                            </Button>
                            {showStudySpots && <Typography>{studySpots?.total_hours}</Typography>}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Top Study Spot</Typography>
                            <Button variant="contained" onClick={() => setShowTopStudySpot(!showTopStudySpot)}>
                                {showTopStudySpot ? 'Hide' : 'View'}
                            </Button>
                            {showTopStudySpot && (
                                <>
                                    <Typography>{topStudySpot?.location}</Typography>
                                    <Typography>Time Spent: {topStudySpot?.max_duration} Hours</Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Top Course</Typography>
                            <Button variant="contained" onClick={() => setShowTopCourse(!showTopCourse)}>
                                {showTopCourse ? 'Hide' : 'View'}
                            </Button>
                            {showTopCourse && (
                                <>
                                    <Typography>{topCourse?.subject}</Typography>
                                    <Typography>Time Spent: {topCourse?.total_hours} Hours</Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Top 5 Users</Typography>
                            <Button variant="contained" onClick={() => setShowTop5Users(!showTop5Users)}>
                                {showTop5Users ? 'Hide' : 'View'}
                            </Button>
                            {showTop5Users && top5users.map((user, index) => (
                                <Typography key={index}>{user.name}: {user.avgrating}</Typography>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Datapage;
