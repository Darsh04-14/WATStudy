import * as React from "react";
import PropTypes from "prop-types";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ToggleColorMode from "./ToggleColorMode";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'


const logoStyle = {
    width: "70px",
    cursor: "pointer",
};

const user = JSON.parse(localStorage.getItem("user") ?? "{}");

function AppAppBar({ mode, toggleColorMode }) {
    const [open, setOpen] = React.useState(false);

    const signOut = useSignOut();
    const isAuthenticated = useIsAuthenticated()

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const scrollToSection = (sectionId) => {
        const sectionElement = document.getElementById(sectionId);
        const offset = 128;
        if (sectionElement) {
            const targetScroll = sectionElement.offsetTop - offset;
            sectionElement.scrollIntoView({ behavior: "smooth" });
            window.scrollTo({
                top: targetScroll,
                behavior: "smooth",
            });
            setOpen(false);
        }
    };

    return (
        <div>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ backgroundColor: "black", padding: "16px 32px" }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Link to="/">
                        <img src={logo} alt="Logo" style={logoStyle} />
                    </Link>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Button
                            variant="text"
                            color="primary"
                            component={Link}
                            to="/study"
                            sx={{ textTransform: "none", fontSize: "1.2rem" }}
                        >
                            Study
                        </Button>
                        <Box component="span" sx={{ mx: 1 }}>
                            {" "}
                            |{" "}
                        </Box>
                        <Button
                            variant="text"
                            color="primary"
                            component={Link}
                            to="/email"
                            sx={{ textTransform: "none", fontSize: "1.2rem" }}
                        >
                            Email
                        </Button>
                        <Box component="span" sx={{ mx: 1 }}>
                            {" "}
                            |{" "}
                        </Box>
                        <Button
                            variant="text"
                            color="primary"
                            component={Link}
                            to="/courses"
                            sx={{ textTransform: "none", fontSize: "1.2rem" }}
                        >
                            Courses
                        </Button>
                        <Box component="span" sx={{ mx: 1 }}>
                            {" "}
                            |{" "}
                        </Box>
                        <Button
                            variant="text"
                            color="primary"
                            component={Link}
                            to="/datapage"
                            sx={{ textTransform: "none", fontSize: "1.2rem" }}
                        >
                            Analytics
                        </Button>
                        <Box component="span" sx={{ mx: 1 }}>
                            {" "}
                            |{" "}
                        </Box>
                        <Button
                            variant="text"
                            color="primary"
                            component={Link}
                            to="/upcomingsessions"
                            sx={{ textTransform: "none", fontSize: "1.2rem" }}
                        >
                            Upcoming Sessions
                        </Button>
                    </Box>
                </Box>

                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={{ textTransform: "none", fontSize: "1.2rem" }}
                >
                    {isAuthenticated && (
                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            sx={{ textTransform: "none", fontSize: "1.2rem" }}
                        >
                            <Button
                                color="primary"
                                variant="outlined"
                                size="small"
                                component={Link}
                                to="/"
                                sx={{
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    padding: "20px 30px",
                                }}
                                onClick={() => {
                                    signOut();
                                    localStorage.removeItem("user");
                                }}
                            >
                                Log out
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </div>
    );
}

AppAppBar.propTypes = {
    mode: PropTypes.oneOf(["dark", "light"]).isRequired,
    toggleColorMode: PropTypes.func.isRequired,
};

export default AppAppBar;
