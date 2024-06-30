// import useSWR from 'swr';
// import axios from 'axios';

// export const useStudySessions = (filters = {}) => {
//     const { data, error, isLoading } = useSWR('/email' + JSON.stringify(filters), async () => {
//         const res = await axios.get(`http://localhost:3800/email`);
//         return res.data;
//     });
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
