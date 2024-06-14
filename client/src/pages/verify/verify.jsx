import { useVerify } from "../../hooks/authHooks";
import { CircularProgress, TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
    password: yup
        .string("Enter your password")
        .min(8, "Password should be of minimum 8 characters length")
        .required("Password is required"),
    name: yup
        .string("Enter your name")
        .required("Name is required")
        .matches(/^[a-zA-Z ]+$/, "Name can only consist of letters"),
});

const Verify = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const verificationToken = searchParams.get("token");
    const { verify, verificationStatus } = useVerify(verificationToken);
    const formik = useFormik({
        initialValues: {
            password: "",
            name: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            verify({ name: values.name, password: values.password });
        },
    });
    if (verificationStatus)
        return (
            <div>
                <Typography>{verificationStatus}</Typography>
            </div>
        );

    return (
        <div>
            {"Enter your desired password"}
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    id="name"
                    name="name"
                    label="name"
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
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
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default Verify;
