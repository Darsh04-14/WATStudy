import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const inputStyle = {
  textAlign: 'center', 
  fontSize: '1.25rem',
  padding: '8px'
};

function JoinRoomModal({ open, handleClose }) {
  const [roomCode, setRoomCode] = React.useState('');
  const [name, setName] = React.useState('');

  const handleJoin = () => {
    // Handle the join room logic here with roomCode and name
    console.log(`Room Code: ${roomCode}, Name: ${name}`);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="join-room-modal-title"
      aria-describedby="join-room-modal-description"
    >
      <Box sx={style}>
        <Typography id="join-room-modal-title" variant="h6" component="h2">
          Join Room
        </Typography>
        <TextField
          label="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          fullWidth
          InputProps={{ style: inputStyle }}
          sx={{ mt: 2, }}
        />
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          InputProps={{ style: inputStyle }}
          sx={{ mt: 2, }}
        />
        <Button onClick={handleJoin} sx={{ mt: 2 }} variant="contained" color="primary">
          Join
        </Button>
        <Button onClick={handleClose} sx={{ mt: 2, ml: 1 }} variant="text" color="primary">
          Close
        </Button>
      </Box>
    </Modal>
  );
}

JoinRoomModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default JoinRoomModal;
