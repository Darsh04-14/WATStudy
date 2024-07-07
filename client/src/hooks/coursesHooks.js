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

    return {
        courses,
        coursesError,
        isCoursesLoading
    };
};
