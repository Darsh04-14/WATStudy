// src/pages/courses/Courses.jsx
import React, { useEffect, useState } from "react";
import { useCourses } from "../../hooks/coursesHooks";
import axios from "axios";
import './couses.css'; // Import the CSS file for styling

const Courses = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const id = JSON.parse(localStorage.getItem('user') ?? '{}')?.uid;
        if (id) {
            setUserId(id);
        } else {
            alert("User ID is required to view the page.");
        }
    }, []);

    const { courses, coursesError, isCoursesLoading, joinCourse } = useCourses(userId);

    const handleJoinCourse = async (subject) => {
        try {
            // Fetch sessionId using the course name
            const response = await axios.get('http://localhost:3800/api/sessionId', {
                params: { subject }
            });
            const sessionId = response.data.id;

            console.log(`User ID: ${userId}, Session ID: ${sessionId}`);

            await joinCourse(sessionId, userId);
            alert('Successfully joined the course!');
        } catch (error) {
            alert('Failed to join the course.');
        }
    };

    if (!userId) return <div>User ID is required</div>;
    if (isCoursesLoading) return <div>Loading...</div>;
    if (coursesError) return <div>Error fetching courses: {coursesError.message}</div>;

    return (
        <div className="courses-container">
            <h1>Suggested Courses!</h1>
            <div className="cards-container">
                {courses && courses.map((course, index) => (
                    <div key={index} className="course-card">
                        <h2>{course.subject}</h2>
                        <p>Total Hours: {course.total_hours}</p>
                        <button
                            style={{ backgroundColor: "blue", color: "white" }}
                            onClick={() => handleJoinCourse(course.subject)}
                        >
                            Join!
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
