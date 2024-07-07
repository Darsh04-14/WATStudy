// src/pages/courses/Courses.jsx
import React, { useEffect, useState } from "react";
import { useCourses } from "../../hooks/coursesHooks";
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

    const { courses, coursesError, isCoursesLoading } = useCourses(userId);

    if (!userId) return <div>User ID is required</div>;
    if (isCoursesLoading) return <div>Loading...</div>;
    if (coursesError) return <div>Error fetching courses: {coursesError.message}</div>;

    return (
        <div className="courses-container">
            <h1>Courses Studied</h1>
            <div className="cards-container">
                {courses && courses.map((course, index) => (
                    <div key={index} className="course-card">
                        <h2>{course.subject}</h2>
                        <p>Total Hours: {course.total_hours}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
