import React, { useEffect, useState } from "react";
import { useStudySessions } from "../../hooks/datapageHooks";

const Datapage = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const id = prompt("Please enter your user ID:");
        if (id) {
            setUserId(id);
        } else {
            console.error("User ID is required");
        }
    }, []);

    const { studySpots, error, isLoading } = useStudySessions(userId);

    useEffect(() => {
        if (studySpots) {
            console.log('details:', studySpots); //checking to see if object is lodaded
        }
        if (error) {
            console.error('Error:', error); //not loaded
        }
    }, [studySpots, error]);

    if (!userId) return <div>User ID is required</div>;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            Hi, this is the data analytics page:
            <div>
                {studySpots && (
                    <div>
                        <p>UID: {studySpots.uid}</p>
                        <p>Password: {studySpots.password}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Datapage;
