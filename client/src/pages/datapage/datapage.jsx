import React, { useEffect, useState } from "react";
import { useStudySessions } from "../../hooks/datapageHooks";

const Datapage = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        promptForUserId();
    }, []);

    const promptForUserId = () => {
        let id = null;
        while (!id) {
            id = prompt("Please enter your user ID:");
            if (!id) {
                alert("User ID is required to view the page.");
            }
        }
        setUserId(id);
    };

    const { studySpots, studySpotsError, isStudySpotsLoading, topStudySpot, topStudySpotError, isTopStudySpotLoading, topCourse, topCourseError, isTopCourseLoading } = useStudySessions(userId);

    useEffect(() => {
        if (studySpots) {
            console.log('Total Hour Details:', studySpots);
        } else if (studySpotsError) {
            console.error('Error:', studySpotsError);
            alert("Error fetching user data: " + studySpotsError.message);
            promptForUserId();
        }
    }, [studySpots, studySpotsError]);

    useEffect(() => {
        if (topStudySpot) {
            console.log('top study spot:', topStudySpot);
        } else if (topStudySpotError) {
            console.error('Error:', topStudySpotError);
            alert("Error fetching top study spot: " + topStudySpotError.message);
            promptForUserId();
        }
    }, [topStudySpot, topStudySpotError]);

    useEffect(() => {
        if (topCourse) {
            console.log('top course details:', topCourse);
        } else if (topCourseError) {
            console.error('Error:', topCourseError);
            alert("Error fetching top course: " + topCourseError.message);
            promptForUserId();
        }
    }, [topCourse, topCourseError]);

    if (!userId) return <div>User ID is required</div>;
    if (isStudySpotsLoading || isTopStudySpotLoading) return <div>Loading...</div>;
    if (isTopCourseLoading) return <div>Loading...</div>;
    if (studySpotsError) return <div>Error: {studySpotsError.message}</div>;
    if (topCourseError) return <div>Error: {topCourseError.message}</div>;
    if (topStudySpotError) return <div>Error: {topStudySpotError.message}</div>;

    return (
        <div>
            Hi, this is the data analytics page:
            <div>

                <div>
                    <p>Total Hours Studied: {studySpots.total_hours}</p>
                </div>


                <div>
                    <p>Top Study Spot: {topStudySpot.location}</p>
                    <p>Time Spent At Top Study Spot {topStudySpot.max_duration} Hours</p>
                </div>

                <div>
                    <p> Top Course: {topCourse.subject}</p>
                    <p> Time Spent On Top Course {topCourse.total_hours} Hours</p>
                </div>
            </div>
        </div>
    );
};

export default Datapage;
