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

    const { studySpots, studySpotsError, isStudySpotsLoading, topStudySpot, topStudySpotError, isTopStudySpotLoading } = useStudySessions(userId);

    useEffect(() => {
        if (studySpots) {
            console.log('details:', studySpots);
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

    if (!userId) return <div>User ID is required</div>;
    if (isStudySpotsLoading || isTopStudySpotLoading) return <div>Loading...</div>;
    if (studySpotsError) return <div>Error: {studySpotsError.message}</div>;
    if (topStudySpotError) return <div>Error: {topStudySpotError.message}</div>;

    return (
        <div>
            Hi, this is the data analytics page:
            <div>
                {studySpots ? (
                    <div>
                        <p>Total Hours Studied: {studySpots.total_hours}</p>
                    </div>
                ) : (
                    <p>No data found</p>
                )}
                {topStudySpot ? (
                    <div>
                        <p>Top Study Spot: {topStudySpot.location}</p>
                        <p>Time Spent At Top Study Spot {topStudySpot.max_duration} Hours</p>
                    </div>
                ) : (
                    <p>No top study spot found</p>
                )}
            </div>
        </div>
    );
};

export default Datapage;
