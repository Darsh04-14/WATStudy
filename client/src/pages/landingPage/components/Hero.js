import { useState, useEffect} from 'react';
import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import JoinRoomModal from '../../../components/joinRoom/joinRoomModal';
import CreateRoomModal from '../../../components/createRoom/createRoomModal';
import {Link} from 'react-router-dom'
import Logo from '../logo/logo.js'
import AnimatedLetters from '../animatedLetters'
import Fade from '@mui/material/Fade';

export default function Hero() {

  const [letterClass, setLetterClass] = useState('text-animate')
  const nameArray = ['W','A','T',' ','S','t','u','d','y']
  
  useEffect(() => {
    setTimeout(() => {
        setLetterClass('text-animate-hover')
    }, 4000);     
},[])

const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after a delay
    const timer = setTimeout(() => setShowContent(true), 1000); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, []);



  const [openJoinModal, setOpenJoinModal] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);

  const handleOpenJoinModal = () => {
    setOpenJoinModal(true);
  };

  const handleCloseJoinModal = () => {
    setOpenJoinModal(false);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  return (
    <>
    <Fade  in={showContent} timeout={1000}>
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        // backgroundImage:
        // theme.palette.mode === 'light'
        // ? 'linear-gradient(180deg, #F4BB00, #fff)'
        // : `linear-gradient(#F4BB00, ${alpha('#000', 0.0)})`,  
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(3.5rem, 10vw, 4rem)',
            }}
          >
             <AnimatedLetters letterClass={letterClass}
                    strArray={nameArray}
                    idx={9}/>

            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: 'clamp(3rem, 10vw, 4rem)',
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              }}
            >
            </Typography>
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
          >
            Connecting Students, Raising GPAs
          </Typography>
          <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignSelf="center"
      spacing={4}
      useFlexGap
      sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
    >
      <Button
        color="primary"
        variant="outlined"
        size="large"
        component={Link}
        to="/login"
        sx={{ textTransform: 'none', fontSize: '1.5rem', padding: '20px 40px' }}
      >
        Log in
      </Button>
      <Button
        color="primary"
        variant="contained"
        size="large"
        component={Link}
        to="/signup"
        sx={{ textTransform: 'none', fontSize: '1.5rem', padding: '20px 40px' }}
      >
        Sign up
      </Button>
    </Stack>
    <Logo/>
      </Stack>
      </Container>
      <JoinRoomModal open={openJoinModal} handleClose={handleCloseJoinModal} />
      <CreateRoomModal open={openCreateModal} handleClose={handleCloseCreateModal} />
      
    </Box>
    </Fade>

  </>

  );
}
