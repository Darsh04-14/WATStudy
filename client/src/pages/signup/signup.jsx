import * as React from 'react';
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, TextField, Typography, Button, ThemeProvider, createTheme } from "@mui/material";
import { useSignUp } from "../../hooks/authHooks";
import getLPTheme from "../landingPage/getLPTheme";
import { styled } from "@mui/system";
import AppAppBar from '../landingPage/components/AppAppBar';

const validationSchema = yup.object({
    email: yup
        .string("Enter your email")
        .email("Enter a valid email")
        .required("Email is required")
        .matches(/uwaterloo.ca$/, "Must be University of Waterloo email"),
});



const FullPageContainer = styled(Box)({
    minHeight: '100vh', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black', 
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'black',
    boxShadow: '0 0 35px 10px #F4BB00',
    p: 4,
  };
    
    const inputStyle = {
    textAlign: 'center', 
    fontSize: '1.25rem',
    padding: '8px'
    };

const SignUp = () => {

    const [mode, setMode] = React.useState('dark');
    const LPtheme = createTheme(getLPTheme(mode));



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
        <ThemeProvider theme={LPtheme}>
        <AppAppBar mode={mode} />
        <FullPageContainer>
            <Box sx={style}>
                <Typography  sx={{ color: 'white', paddingBottom: 2 }} variant="h6">Enter @uwaterloo.ca email:</Typography>
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
                        InputProps={{ style: inputStyle }}
                        sx={{marginBottom: 3}}
                    />
                    <Box>
                    <Button color="primary" variant="contained" type="submit">
                        Submit
                    </Button>
                    </Box>
                </form>
            </Box>
            </FullPageContainer>
        </ThemeProvider>
    );
};

export default SignUp;
