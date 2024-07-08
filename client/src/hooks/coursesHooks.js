// src/hooks/coursesHooks.js
import useSWR from "swr";
import axios from "axios";

export const useCourses = (userId) => {
    const { data: courses, error: coursesError, isLoading: isCoursesLoading } = useSWR(
        userId ? ['/courses', userId] : null,
        async () => {
            const res = await axios.get(`http://localhost:3800/courses`, {
                params: { userId }
            });
            return res.data;
        }
    );

    const joinCourse = async (sessionId, userId) => {
        try {
            console.log(`Joining course with User ID: ${userId}, Session ID: ${sessionId}`);
            const response = await axios.post('http://localhost:3800/api/participants', {
                sessionId,
                userId
            });
            return response.data;
        } catch (error) {
            console.error('Error joining course:', error);
            throw error;
        }
    };

    return {
        courses,
        coursesError,
        isCoursesLoading,
        joinCourse
    };
};
