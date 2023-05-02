import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { Card, CardActions, CardContent, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import Issues from './Issues';
import IssuesForm from './IssuesForm';
import api from './api';

const ProjectCard = ({ project }) => {
    const [userType, setUserType] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleDeleteClick = () => {
        // Open the confirmation dialog
        setOpenDialog(true);
    };

    const handleDialogClose = (confirmed) => {
        if (confirmed) {
            // Call the handleSubmit function to delete the project
            handleSubmit();
        }
        // Close the confirmation dialog
        setOpenDialog(false);
    };

    React.useEffect(() => {
        const getUserType = async () => {
            try {
                const email = localStorage.getItem('email');
                const response = await api.get('/user', {
                    params: {
                        email: email,
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUserType(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getUserType();
    }, []);

    const handleDeleteSubmit = async () => {
        const email = localStorage.getItem('email');
        const projectName = project.project_name;
        const res = await api.delete(`/projects?email=${email}&projectName=${projectName}`);
        return res.data;
    };

    const { mutate } = useMutation(handleDeleteSubmit, {
        onSuccess: (data) => {
            //console.log(data)
        },
        onError: (error) => {
            console.error(error)
        },
    });


    const handleSubmit = (e) => {
        if (e) {
          e.preventDefault();
        }
        mutate();
      };

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Project ID: {project.project_id}
                </Typography>
                <Typography variant="h5" component="div">
                    {project.project_name}
                    <CardActions>
                        {userType === 'administrator' ? (
                            <Button onClick={handleDeleteClick} size="small">DELETE PROJECT</Button>
                        ) : (
                            null
                        )}
                    </CardActions>
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Description:
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    {project.project_description}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Created by:
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    {project.created_by}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Issues:
                </Typography>
                {/* Render issues */}
                <Issues project={project} />
                <IssuesForm project={project} />
            </CardContent>
            {/* Confirmation dialog */}
            <Dialog open={openDialog} onClose={() => handleDialogClose(false)}>
                <DialogTitle>Are you sure you want to delete the project?</DialogTitle>
                <DialogContent>
                    <Typography>This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDialogClose(false)}>CANCEL</Button>
                    <Button onClick={() => handleDialogClose(true)}>DELETE</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}

export default ProjectCard