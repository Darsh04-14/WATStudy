import useSWR from "swr";
import axios from "axios";

export const useStudySessions = (userId, filters = {}) => {
    const { data, error, isLoading } = useSWR(
        ['/data', userId, filters],
        async () => {
            const res = await axios.get(`http://localhost:3800/data`, {
                params: { userId, filters }
            });
            return res.data;
        }
    );

    return { studySpots: data, error, isLoading };
};
