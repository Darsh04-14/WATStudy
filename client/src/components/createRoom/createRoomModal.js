import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlaceIcon from '@mui/icons-material/Place';
import SubjectIcon from '@mui/icons-material/Subject';
import DescriptionIcon from '@mui/icons-material/Description';

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

function CreateRoomModal({ open, handleClose }) {
  const [subject, setSubject] = React.useState('');
  const [roomName, setRoomName] = React.useState('');
  const [time, setTime] = React.useState('');
  const [date, setDate] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [groupSize, setGroupSize] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleCreate = () => {
    // Handle the create room logic here with the form data
    console.log({ subject, roomName, time, date, location, groupSize, description });
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-room-modal-title"
      aria-describedby="create-room-modal-description"
    >
      <Box sx={style}>
        <Typography id="create-room-modal-title" variant="h6" component="h2">
          Create Room
        </Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Box display="flex" alignItems="center">
            <SubjectIcon sx={{ mr: 1 }} />
            <TextField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              InputProps={{ style: inputStyle }}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <DescriptionIcon sx={{ mr: 1 }} />
            <TextField
              label="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              fullWidth
              InputProps={{ style: inputStyle }}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <AccessTimeIcon sx={{ mr: 1 }} />
            <TextField
              label="Time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
              InputProps={{ style: inputStyle }}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <CalendarTodayIcon sx={{ mr: 1 }} />
            <TextField
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              InputProps={{ style: inputStyle }}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <PlaceIcon sx={{ mr: 1 }} />
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              InputProps={{ style: inputStyle }}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <PeopleIcon sx={{ mr: 1 }} />
            <TextField
              label="Group Size"
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              fullWidth
              InputProps={{ style: inputStyle }}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <DescriptionIcon sx={{ mr: 1 }} />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              InputProps={{ style: inputStyle }}
              multiline
            />
          </Box>
        </Stack>
        <Button onClick={handleCreate} sx={{ mt: 2 }} variant="contained" color="primary">
          Create
        </Button>
        <Button onClick={handleClose} sx={{ mt: 2, ml: 1 }} variant="text" color="secondary">
          Close
        </Button>
      </Box>
    </Modal>
  );
}

CreateRoomModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CreateRoomModal;
