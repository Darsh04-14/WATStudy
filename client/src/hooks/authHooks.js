import useSWRMutation from "swr/mutation";
import axios from "axios";
import useSignIn from "react-auth-kit/hooks/useSignIn";

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
    const signIn = useSignIn();
    const { trigger, isMutating } = useSWRMutation(
        ["/login", new Date()],
        async (url, { arg }) => {
            console.log("user creds", arg);
            const res = await axios.post(`http://localhost:3800/login`, {
                email: arg.email,
                password: arg.password,
            });
            return res.data;
        },
        {
            onSuccess: (data) => {
                console.log(data);
                const userString = atob(data.split(".")[1]);
                localStorage.setItem('user', userString);
                signIn({
                    auth: {
                        token: data,
                        type: "Bearer"
                    },
                });
            },
        }
    );

    return { login: trigger, isPending: isMutating };
};
