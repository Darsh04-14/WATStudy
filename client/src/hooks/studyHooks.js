import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "axios";

export const useStudySessions = (filters = {}) => {
    const { data, error, isLoading } = useSWR(
        "/studysession" + JSON.stringify(filters),
        async () => {
            const res = await axios.get(`http://localhost:3800/studysession`);
            return res.data;
        }
    );

    return { studySpots: data, error, isLoading };
};

export const useCreateSession = () => {
    const { trigger } = useSWRMutation(
        "/studysession",
        async (url, { arg }) => {
            axios.post(`http://localhost:3800/studysession`, { data: { ...arg } });
        }
    );

    return { createSession: trigger };
};
