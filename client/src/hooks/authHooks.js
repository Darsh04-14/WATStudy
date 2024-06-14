import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import axios from "axios";

export const useSignUp = () => {
    const { trigger, isMutating } = useSWRMutation(
        "/signup",
        async (url, { arg }) => {
            axios.post(`http://localhost:3800/signup`, {
                email: arg,
            });
        }
    );

    return { signUp: trigger, isPending: isMutating };
};

export const useVerify = (token) => {
    const { trigger, data, isMutating } = useSWRMutation(
        "/verify" + token,
        async (url, { arg }) => {
            console.log("user password", arg);
            axios.post(`http://localhost:3800/verify`, {
                token: token,
                name: arg.name,
                password: arg.password,
            });
        }
    );

    return { verify: trigger, verificationStatus: data, isPending: isMutating };
};

export const useLogin = () => {
    const { trigger, data, isMutating } = useSWRMutation(
        ["/login", new Date()],
        async (url, { arg }) => {
            console.log("user creds", arg);
            const res = await axios.post(`http://localhost:3800/login`, {
                email: arg.email,
                password: arg.password,
            });
            return res.data;
        }
    );

    return { login: trigger, loginStatus: data, isPending: isMutating };
};
