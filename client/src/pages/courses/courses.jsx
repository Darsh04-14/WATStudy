// // src/pages/courses/Courses.jsx
// import React, { useEffect, useState } from "react";
// import { useCourses } from "../../hooks/coursesHooks";
// import axios from "axios";
// import { Box, Typography, Button, CircularProgress, ThemeProvider, createTheme } from "@mui/material";
// import CourseSessionCard from "../../components/sessionCard/coursesCard";
// import SessionModal from "../../components/sessionModal/sessionModal"; // Import SessionModal
// import { styled } from "@mui/system";
// import AppAppBar from '../landingPage/components/AppAppBar';
// import getLPTheme from "../landingPage/getLPTheme";

// const axiosInstance = axios.create({
//     withCredentials: true // Ensure credentials are sent with every request
// });

// const FullPageContainer = styled(Box)({
//     minHeight: '100vh', 
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'black',
// });

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'black',
//     boxShadow: '0 0 35px 10px #F4BB00',
//     padding: 3,
//     color: 'white'
// };

// const Courses = () => {
//     const [mode, setMode] = useState('dark');
//     const LPtheme = createTheme(getLPTheme(mode));
//     const [userId, setUserId] = useState(null);
//     const [open, setOpen] = useState(false);
//     const [selectedCourse, setSelectedCourse] = useState(null);

//     useEffect(() => {
//         const id = JSON.parse(localStorage.getItem('user') ?? '{}')?.uid;
//         if (id) {
//             setUserId(id);
//         } else {
//             alert("User ID is required to view the page.");
//         }
//     }, []);

//     const { courses, coursesError, isCoursesLoading, joinCourse } = useCourses(userId);

//     const handleJoinCourse = async (subject) => {
//         try {
//             // Fetch sessionId using the course name
//             const response = await axiosInstance.get('http://localhost:3800/api/sessionId', {
//                 params: { subject }
//             });
//             const sessionId = response.data.id;

//             console.log(`User ID: ${userId}, Session ID: ${sessionId}`);

//             await joinCourse(sessionId, userId);
//             alert('Successfully joined the course!');
//         } catch (error) {
//             alert('Failed to join the course.');
//         }
//     };

//     const handleOpenModal = (course) => {
//         setSelectedCourse(course);
//         setOpen(true);
//     };

//     const handleCloseModal = () => {
//         setOpen(false);
//         setSelectedCourse(null);
//     };

//     if (!userId) return <div>User ID is required</div>;
//     if (isCoursesLoading) return <CircularProgress />;
//     if (coursesError) return <div>Error fetching courses: {coursesError.message}</div>;

//     return (
//         <ThemeProvider theme={LPtheme}>
//             <AppAppBar mode={mode} />
//             <FullPageContainer>
//                 <Box sx={{ style }}>
//                     <Typography variant="h3" component="h1" gutterBottom style={{ color: 'white' }}>
//                         Suggested Courses!
//                     </Typography>
//                     <Box
//                         sx={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             justifyContent: "center",
//                             gap: 3,
//                             marginBottom: "1vh",
//                         }}
//                     >
//                         {courses.map((course, index) => (
//                             <CourseSessionCard
//                                 key={index}
//                                 courseSession={{ title: course.subject, total_hours: course.total_hours }} // Map course data to SessionCard props
//                                 onClick={() => handleJoinCourse(course.subject)}
//                             />
//                         ))}
//                     </Box>
//                 </Box>
//                 <SessionModal
//                     open={open}
//                     handleClose={handleCloseModal}
//                     // Pass additional props if needed
//                 />
//             </FullPageContainer>
//         </ThemeProvider>
//     );
// };

// export default Courses;


// src/pages/courses/Courses.jsx
import React, { useEffect, useState } from "react";
import { useCourses } from "../../hooks/coursesHooks";
import axios from "axios";
import { Box, Typography, Button, CircularProgress, ThemeProvider, createTheme } from "@mui/material";
import CourseSessionCard from "../../components/coursesCard/coursesCard"; 
import SessionModal from "../../components/sessionModal/sessionModal";
import { styled } from "@mui/system";
import AppAppBar from '../landingPage/components/AppAppBar';
import getLPTheme from "../landingPage/getLPTheme";

const axiosInstance = axios.create({
    withCredentials: true // Ensure credentials are sent with every request
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
    padding: 3,
    color: 'white'
};

const Courses = () => {
    const [mode, setMode] = useState('dark');
    const LPtheme = createTheme(getLPTheme(mode));
    const [userId, setUserId] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        const id = JSON.parse(localStorage.getItem('user') ?? '{}')?.uid;
        if (id) {
            setUserId(id);
        } else {
            alert("User ID is required to view the page.");
        }
    }, []);

    const { courses, coursesError, isCoursesLoading, joinCourse } = useCourses(userId);

    const handleJoinCourse = async (subject) => {
                try {
                    // Fetch sessionId using the course name
                    const response = await axiosInstance.get('http://localhost:3800/api/sessionId', {
                        params: { subject }
                    });
                    const sessionId = response.data.id;
        
                    console.log(`User ID: ${userId}, Session ID: ${sessionId}`);
        
                    await joinCourse(sessionId, userId);
                    alert('Successfully joined the course!');
                } catch (error) {
                    alert('Successfully joined the course!');
                }
            };

    const handleOpenModal = (course) => {
        setSelectedCourse(course);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedCourse(null);
    };

    if (!userId) return <div>User ID is required</div>;
    if (isCoursesLoading) return <CircularProgress />;
    if (coursesError) return <div>Error fetching courses: {coursesError.message}</div>;

    return (
        <ThemeProvider theme={LPtheme}>
            <AppAppBar mode={mode} />
            <FullPageContainer>
                <Box sx={{ style }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Typography variant="h3" component="h1" gutterBottom style={{ color: 'white'}}>
                    Suggested Courses
                </Typography>
                
            </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: 3,
                            marginBottom: "1vh",
                        }}
                    >
                        {courses.map((course, index) => (
                            <CourseSessionCard
                                key={index}
                                courseSession={{ title: course.subject, total_hours: course.total_hours }}
                                onClick={() => handleJoinCourse(course.subject)}
                            />
                        ))}
                    </Box>
                </Box>
                <SessionModal
                    open={open}
                    handleClose={handleCloseModal}
                    // Pass additional props if needed
                />
            </FullPageContainer>
        </ThemeProvider>
    );
};

export default Courses;
