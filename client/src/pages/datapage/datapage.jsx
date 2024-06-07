import React, { useEffect, useState } from "react";
import { useStudySessions } from "../../hooks/datapageHooks";

const Datapage = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const id = prompt("Please enter your user ID:");
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
            Hi, this is the data analytics page:
            <div>
                <div>
                    <p>Total Hours Studied: {studySpots?.total_hours}</p>
                </div>
                <div>
                    <p>Top Study Spot: {topStudySpot?.location}</p>
                    <p>Time Spent At Top Study Spot: {topStudySpot?.max_duration} Hours</p>
                </div>
                <div>
                    <p>Top Course: {topCourse?.subject}</p>
                    <p>Time Spent On Top Course: {topCourse?.total_hours} Hours</p>
                </div>
                <div>
                    <p> Top 5 users:
                        {top5users[0] && (
                            <div>
                                {top5users[0].name}: {top5users[0].avgrating},
                                {top5users[1].name}: {top5users[1].avgrating},
                                {top5users[2].name}: {top5users[2].avgrating},
                                {top5users[3].name}: {top5users[3].avgrating},
                                {top5users[4].name}: {top5users[4].avgrating}

                            </div>
                        )}





                    </p>
                </div>
            </div>
        </div>
    );
};

export default Datapage;
