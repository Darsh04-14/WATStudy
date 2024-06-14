import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, TextField, Typography, Button } from "@mui/material";
import { useSignUp } from "../../hooks/authHooks";

const validationSchema = yup.object({
    email: yup
        .string("Enter your email")
        .email("Enter a valid email")
        .required("Email is required")
        .matches(/uwaterloo.ca$/, "Must be University of Waterloo email"),
});

const SignUp = () => {
    const { signUp } = useSignUp();
    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            signUp(values.email);
        },
    });
    return (
        <Box>
            <Typography>Enter @uwaterloo.ca email:</Typography>
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
                <Button color="primary" variant="contained" type="submit">
                    Submit
                </Button>
            </form>
        </Box>
    );
};

export default SignUp;
