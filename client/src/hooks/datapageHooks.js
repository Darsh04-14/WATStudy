import useSWR from "swr";
import axios from "axios";

export const useStudySessions = (userId, filters = {}) => {
    const { data: studySpots, error: studySpotsError, isLoading: isStudySpotsLoading } = useSWR(
        ['/data', userId, filters],
        async () => {
            const res = await axios.get(`http://localhost:3800/data`, {
                params: { userId, filters }
            });
            return res.data;
        }
    );

    const { data: topStudySpot, error: topStudySpotError, isLoading: isTopStudySpotLoading } = useSWR(
        ['/topstudyspot', userId, filters],
        async () => {
            const res = await axios.get(`http://localhost:3800/topstudyspot`, {
                params: { userId, filters }
            });
            return res.data;
        }
    );

    const { data: topCourse, error: topCourseError, isLoading: isTopCourseLoading } = useSWR(
        ['/topcourse', userId, filters],
        async () => {
            const res = await axios.get(`http://localhost:3800/topcourse`, {
                params: { userId, filters }
            });
            return res.data;
        }
    );

    const { data: top5users, error: top5usersError, isLoading: istop5usersLoading } = useSWR(
        ['/top5users', userId, filters],
        async () => {
            const res = await axios.get(`http://localhost:3800/top5users`, {
                params: { userId, filters }
            });
            return res.data;
        }
    );

    return { studySpots, studySpotsError, isStudySpotsLoading, topStudySpot, topStudySpotError, isTopStudySpotLoading, topCourse, topCourseError, isTopCourseLoading, top5users, top5usersError, istop5usersLoading };
};
