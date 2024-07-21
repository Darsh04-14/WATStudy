// import React from 'react';
// import { Card, CardContent, Typography, Button, Box } from '@mui/material';

// const CourseSessionCard = ({ courseSession, onClick }) => {
//     return (
//         <Card sx={{ marginBottom: 2, padding: 2, width: 300,  bgcolor: 'black',
//             boxShadow: '0 0 10px 1px #F4BB00',
//             p: 4, }}>
//             <CardContent>
//                 <Typography variant="h5" component="div">
//                     {courseSession.subject}
//                 </Typography>
//                 <Typography sx={{ mb: 1.5 }} color="text.secondary">
//                     {courseSession.courseNumber} - {courseSession.title}

//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                     Date: {courseSession.session_date}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                     Total Hours: {courseSession.total_hours} 
//                 </Typography>
//                 <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
//                     <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); onClick(); }}>
//                         Join
//                     </Button>
//                 </Box>
//             </CardContent>
//         </Card>
//     );
// };

// export default CourseSessionCard;

// src/components/courseSessionCard/CourseSessionCard.jsx
import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';

const CourseSessionCard = ({ courseSession, onClick }) => {
    return (
        <Card 
            sx={{ width: 300, margin: 2, cursor: 'pointer' }}
            onClick={onClick}
        >
            <CardContent>
                <Typography variant="h6">{courseSession.title}</Typography>
                <Typography variant="body2">Total Hours: {courseSession.total_hours}</Typography>
                <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={(e) => { 
                            e.stopPropagation();
                            onClick(); 
                        }}
                    >
                        Join
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CourseSessionCard;
