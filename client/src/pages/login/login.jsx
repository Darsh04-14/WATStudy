import { TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useLogin } from "../../hooks/authHooks";
import { useContext, useEffect } from "react";

const validationSchema = yup.object({
    password: yup
        .string("Enter your password")
        .required("Password is required"),
    email: yup
        .string("Enter your email")
        .email("Enter a valid email")
        .required("Email is required")
        .matches(/uwaterloo.ca$/, "Must be University of Waterloo email"),
});

const Login = () => {
    const { login, loginStatus } = useLogin();

    useEffect(() => {
        if (loginStatus)
            localStorage.setItem("user", JSON.stringify(loginStatus));
    }, [loginStatus])

    const formik = useFormik({
        initialValues: {
            password: "",
            email: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            login(values);
        },
    });

    return (
        <div>
            {"Enter your email and password"}
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
                    }
                    helperText={
                        formik.touched.password && formik.errors.password
                    }
                />
                <Button color="primary" variant="contained" type="submit">
                    Login
                </Button>
            </form>
        </div>
    );
};

export default Login;
