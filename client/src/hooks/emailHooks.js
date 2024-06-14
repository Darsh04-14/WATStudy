import useSWR from 'swr';
import axios from 'axios';

export const useStudySessions = (userId) => {
    const fetcher = (url) => axios.get(url).then((res) => res.data);

    const { data, error } = useSWR(
        userId ? `http://localhost:3800/email?userId=${userId}` : null,
        fetcher
    );

    return {
        studySpots: data,
        isLoading: !error && !data,
        error,
    };
};
