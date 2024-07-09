import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import JoinRoomModal from '../../../components/joinRoom/joinRoomModal';
import CreateRoomModal from '../../../components/createRoom/createRoomModal';


export default function Hero() {

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
            WAT Study
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
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
          >
            <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>
              Create Room
            </Button>
            <Button variant="contained" color="primary" onClick={handleOpenJoinModal}>
              Join Room
            </Button>
          </Stack>
        </Stack>
      </Container>
      <JoinRoomModal open={openJoinModal} handleClose={handleCloseJoinModal} />
      <CreateRoomModal open={openCreateModal} handleClose={handleCloseCreateModal} />
    </Box>
  );
}
