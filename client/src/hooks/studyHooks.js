import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "axios";

export const useStudySessions = (filter = {}) => {
    const { data, error, isLoading } = useSWR(
        "/studysession?filter=" + encodeURI(JSON.stringify(filter)),
        async () => {
            const res = await axios.get(
                `http://localhost:3800/studysession?filter=${encodeURI(
                    JSON.stringify(filter)
                )}`
            );
            return res.data;
        }
    );

    return { studySpots: data, error, isLoading };
};

export const useCreateSession = () => {
    const { trigger, isMutating } = useSWRMutation(
        "create/studysession",
        async (url, { arg }) => {
            axios.post(`http://localhost:3800/studysession`, {
                data: arg
            });
        }
    );

    return { createSession: trigger, isCreating: isMutating };
};

export const useDeleteSession = () => {
    const { trigger, isMutating } = useSWRMutation(
        "delete/studysession",
        async (url, { arg }) => {
            console.log(arg);
            axios.delete(`http://localhost:3800/studysession`, {
                data: { id: arg },
            });
        }
    );
    return { deleteSession: trigger, isDeleting: isMutating };
};
