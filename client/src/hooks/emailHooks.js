// import useSWR from 'swr';
// import axios from 'axios';

// export const useStudySessions = (filters = {}) => {
//     const { data, error, isLoading } = useSWR('/email' + JSON.stringify(filters), async () => {
//         const res = await axios.get(`http://localhost:3800/email`);
//         return res.data;
//     });

//     return { studySpots: data, error, isLoading };
// }


