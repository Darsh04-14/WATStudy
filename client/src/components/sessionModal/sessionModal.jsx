import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Box, Modal, TextField, Button, Typography } from '@mui/material';
import { useCreateSession } from '../../hooks/studyHooks';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const inputStyle = {
  textAlign: 'center', 
  fontSize: '1.25rem',
  padding: '8px',
};

const SessionModal = ({ open, handleClose }) => {
  const { createSession } = useCreateSession();

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" sx={{ mb: 2, color:'white' }}>
          Create New Session
        </Typography>
        <Formik
          initialValues={{
            title: '',
            subject: '',
            description: '',
            session_date: '',
            duration: 0,
            location: '',
            group_size: 0,
          }}
          onSubmit={(values) => {
            createSession(values);
            handleClose(); // Close modal after submission
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <Field
                name="title"
                as={TextField}
                label="Title"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                InputProps={{ style: inputStyle }}
              />
              <Field
                name="subject"
                as={TextField}
                label="Subject"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                InputProps={{ style: inputStyle }}
              />
              <Field
                name="description"
                as={TextField}
                label="Description"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                sx={{ mb: 2 }}
                InputProps={{ style: inputStyle }}  
              />
              <Field
                name="session_date"
                as={TextField}
                type="datetime-local"
                label="Session Date"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                InputLabelProps={{
                    shrink: true, // Ensures the label is always above the input field
                }}
                InputProps={{
                    style: {
                    padding: '8px', // Adjust padding if necessary
                    fontSize: '1.25rem',
                    },
                }}
                />

              <Field
                name="duration"
                as={TextField}
                type="number"
                label="Duration (minutes)"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Field
                name="group_size"
                as={TextField}
                type="number"
                label="Group Size"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Field
                name="location"
                as={TextField}
                label="Location"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                InputProps={{ style: inputStyle }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="text"
                  color="secondary"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default SessionModal;
