import React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useMutation } from 'react-query';
import api from "./api";

const ProjectForm = ({ userType }) => {
    const [open, setOpen] = React.useState(false);
    const [project_name, setProjectName] = React.useState();
    const [email, setEmail] = React.useState(localStorage.getItem('email'));
    const [users, setAssignedPersonEmail] = React.useState([]);
    const [project_description, setProjectDescription] = React.useState('');

    const handleAssignedPersonEmailChange = (event) => {
        setAssignedPersonEmail(event.target.value.split(',').map(email => email.trim()));
    };
    const handleIssueDescriptionChange = (event) => {
        setProjectDescription(event.target.value);
    };
    const handleProjectName = (event) => {
        setProjectName(event.target.value);
    }

    const handleFormSubmit = async () => {
        const response = await api.post('/projects',
            {
                project_name,
                email,
                users,
                project_description,
            });
        return response.data;
    };

    const { mutate } = useMutation(handleFormSubmit, {
        onSuccess: (data) => {
            setOpen(false);
        },
        onError: (error) => {
        },
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        mutate();
    };


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            {userType === 'administrator' ? (
                <Button sx={{ color: 'red' }} variant="outlined" onClick={handleClickOpen}>
                    Create Project
                </Button>
            ) : (
                null
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create a New Project</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill out the form below to create a new Project.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="projectName"
                        label="Project Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={project_name}
                        onChange={handleProjectName}
                    />
                    <TextField
                        margin="dense"
                        id="assignedPersonEmail"
                        label="Assigned Person(s) Email(s) (comma-separated)"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={users.join(', ')}
                        onChange={handleAssignedPersonEmailChange}
                    />
                    <TextField
                        margin="dense"
                        id="issueDescription"
                        label="Project Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        value={project_description}
                        onChange={handleIssueDescriptionChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProjectForm