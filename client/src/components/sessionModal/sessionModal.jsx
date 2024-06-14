import { Formik, Form, Field } from "formik";
import { Box, Modal } from "@mui/material";
import { useCreateSession } from "../../hooks/studyHooks";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const SessionModal = ({ open, handleClose }) => {
    const { createSession } = useCreateSession();

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Formik
                    initialValues={{
                        title: "",
                        subject: "",
                        description: "",
                        session_date: "",
                        duration: 0,
                        location: "",
                    }}
                    onSubmit={(values) => createSession(values)}
                >
                    <Form>
                        <Field type="text" name="title" />
                        <Field type="text" name="subject" />
                        <Field type="text" name="description" />
                        <Field type="datetime-local" name="session_date" />
                        <Field type="number" name="duration" />
                        <Field type="text" name="location" />
                        <button type="submit">Submit</button>
                    </Form>
                </Formik>
            </Box>
        </Modal>
    );
};

export default SessionModal;
