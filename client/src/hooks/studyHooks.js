import useSWR from "swr";
import axios from "axios";

export const useStudySessions = (filter = {}) => {
    const { data: studySpots, error: studySpotsError, isLoading: isStudySpotsLoading } = useSWR(
        `/studysession?filter=${encodeURI(JSON.stringify(filter))}`,
        async () => {
            const res = await axios.get(
                `http://localhost:3800/studysession?filter=${encodeURI(JSON.stringify(filter))}`
            );
            return res.data;
        }
    );

    return {
        studySpots,
        studySpotsError,
        isStudySpotsLoading,
    };
};

export const useCreateSession = () => {
    const createSession = async (data) => {
        try {
            const response = await axios.post('http://localhost:3800/studysession', data);
            return response.data;
        } catch (error) {
            console.error("Error creating session:", error);
            throw error;
        }
    };

    return { createSession };
};

export const useDeleteSession = () => {
    const deleteSession = async (id) => {
        try {
            await axios.delete(`http://localhost:3800/studysession`, {
                data: { id }
            });
        } catch (error) {
            console.error("Error deleting session:", error);
            throw error;
        }
    };

    return { deleteSession };
};

export const useJoinSession = () => {
    const joinSession = async (sessionId, userId) => {
        try {
            console.log(`Joining session with User ID: ${userId}, Session ID: ${sessionId}`);
            const response = await axios.post('http://localhost:3800/api/participants', {
                sessionId,
                userId
            });
            return response.data;
        } catch (error) {
            console.error('Error joining session:', error);
            throw error;
        }
    };

    return { joinSession };
};
