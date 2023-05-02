import React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { useMutation } from 'react-query';
import api from "./api";

const IssuesForm = ({ project }) => {

    const [open, setOpen] = React.useState(false);
    const [priority, setPriority] = React.useState('low');
    const [project_name, setProjectName] = React.useState(project.project_name);
    const [email, setEmail] = React.useState(localStorage.getItem('email'));
    const [assignedPersonEMail, setAssignedPersonEmail] = React.useState([]);
    const [issue_title, setIssueTitle] = React.useState('');
    const [issue_description, setIssueDescription] = React.useState('');
    const [status, setStatus] = React.useState('pending');

    const handlePriorityChange = (event) => {
        setPriority(event.target.value);
    };
    const handleAssignedPersonEmailChange = (event) => {
        setAssignedPersonEmail(event.target.value.split(',').map(email => email.trim()));
    };
    const handleIssueTitleChange = (event) => {
        setIssueTitle(event.target.value);
    };
    const handleIssueDescriptionChange = (event) => {
        setIssueDescription(event.target.value);
    };
   
    const handleFormSubmit = async () => {
        const response = await api.post('/issues',
         { 
            project_name, 
            email,
            assignedPersonEMail,
            issue_title,
            issue_description,
            status,
            priority
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
            <Button variant="outlined" onClick={handleClickOpen}>
                Report Issue
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create a New Issue</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill out the form below to create a new issue.
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
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                    />
                    <TextField
                        margin="dense"
                        id="assignedPersonEmail"
                        label="Assigned Person Email(s) (comma-separated)"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={assignedPersonEMail.join(', ')}
                        onChange={handleAssignedPersonEmailChange}
                    />
                    <TextField
                        margin="dense"
                        id="issueTitle"
                        label="Issue Title"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={issue_title}
                        onChange={handleIssueTitleChange}
                    />
                    <TextField
                        margin="dense"
                        id="issueDescription"
                        label="Issue Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        value={issue_description}
                        onChange={handleIssueDescriptionChange}
                    />
                    <RadioGroup
                        aria-label="priority"
                        name="priority"
                        value={priority}
                        onChange={handlePriorityChange}
                    >
                        <DialogContentText>
                            Priority:
                        </DialogContentText>
                        <FormControlLabel value="low" control={<Radio />} label="Low" />
                        <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                        <FormControlLabel value="high" control={<Radio />} label="High" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default IssuesForm