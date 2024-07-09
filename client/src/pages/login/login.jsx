import * as React from 'react';
import { TextField, Button, ThemeProvider, Typography, Box, createTheme } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useLogin } from "../../hooks/authHooks";
import getLPTheme from "../landingPage/getLPTheme";
import { styled } from "@mui/system";
import AppAppBar from '../landingPage/components/AppAppBar';

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
  
const Login = () => {
    const LPtheme = createTheme(getLPTheme('dark'));
    
    const { login } = useLogin();

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
        <ThemeProvider theme={LPtheme}>
        <AppAppBar mode={'dark'} />
            <FullPageContainer>
                <Box sx={style}>
                    
                <div>
                <Typography sx={{ color: 'white', paddingBottom: 2 }} variant="h6">
                    Enter your email and password
                    </Typography>
                    
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
                            sx={{marginBottom: 2}}
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
                            InputProps={{ style: inputStyle }}
                            sx={{marginBottom: 3}}
                        />
                        <Box>
                            <Button color="primary" variant="contained" type="submit">
                                Login
                            </Button>
                        </Box>
                    </form>
                </div>
                </Box>
            </FullPageContainer>
        </ThemeProvider>
    );
};

export default Login;
