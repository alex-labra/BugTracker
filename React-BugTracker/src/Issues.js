import React from 'react';
import { Box, Typography, Alert, Button, Menu, MenuItem, Divider, } from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import api from './api';

//MUI code
const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
    },
}));


//Issues code
const Issues = ({ project }) => {
    const highPriorityIssues = [];
    const mediumPriorityIssues = [];
    const lowPriorityIssues = [];
    const resolvedIssues = [];

    project.issues.forEach((issue) => {
        if (issue.status === 'resolved') {
            resolvedIssues.push(issue);
        } else if (issue.priority === 'high') {
            highPriorityIssues.push(issue);
        } else if (issue.priority === 'medium') {
            mediumPriorityIssues.push(issue);
        } else if (issue.priority === 'low') {
            lowPriorityIssues.push(issue);
        }
    });

    const sortedIssues = [
        ...highPriorityIssues,
        ...mediumPriorityIssues,
        ...lowPriorityIssues,
        ...resolvedIssues,
    ];

    //MUI code
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setBColors(['', '', '', '', '']);
        setInput('');
        setInputId();
        setInputStatus('');
        setInputPriority('');
    };

    const [bColors, setBColors] = React.useState(['', '', '', '', '']);
    const [input, setInput] = React.useState('');
    const [inputId, setInputId] = React.useState();
    const [inputStatus, setInputStatus] = React.useState('');
    const [inputPriority, setInputPriority] = React.useState('');

    const handleBackground = (index) => {
        const newBColors = bColors.map((color, i) => i === index ? '#D3D3D3' : '');
        setBColors(newBColors);
    };

    React.useEffect(() => {
        if (input === 'high' || input === 'medium' || input === 'low') {
            setInputStatus('pending');
            setInputPriority(input);
        } else if (input === 'resolved') {
            setInputStatus('resolved');
            setInputPriority('none');
        } else {
            setInput('');
            setInputId();
            setInputStatus('');
            setInputPriority('');
        }
    }, [input]);

    //Update issues
    const handleUpdateIssue = async () => {
        try {
            const response = await api.put('issues', {

                issue_id: inputId,
                status: inputStatus,
                priority: inputPriority

            });

            if (!response.ok) {
                throw new Error('Failed to update issue');
            }

            handleClose();
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div>
            {sortedIssues.map((issue) => {
                let severity = '';
                if (issue.priority === 'low') {
                    severity = 'info';
                } else if (issue.priority === 'medium') {
                    severity = 'warning';
                } else if (issue.priority === 'high') {
                    severity = 'error';
                } else if (issue.status === 'resolved') {
                    severity = 'success';
                }
                return (
                    <Alert sx={{ m: '5px' }} key={issue.issue_id} severity={severity}>
                        <Box sx={{ mb: 1, }}>
                            <Typography variant="subtitle1">{issue.issue_title}</Typography>
                            <Typography variant="body2">{issue.issue_description}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Status: {issue.status}, Priority: {issue.priority}
                            </Typography>
                        </Box>
                        <div>
                            <Button
                                id="demo-customized-button"
                                aria-controls={open ? 'demo-customized-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                variant="contained"
                                disableElevation
                                onClick={(event) => { setInputId(issue.issue_id); handleClick(event); }}
                                endIcon={<KeyboardArrowDownIcon />}
                            >
                                Update Issue
                            </Button>
                            <StyledMenu
                                id="demo-customized-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'demo-customized-button',
                                }}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem
                                    sx={{ backgroundColor: bColors[0] }}
                                    onClick={() => { setInput('high'); handleBackground(0); }}
                                    disableRipple
                                >
                                    Priority: High
                                </MenuItem>
                                <MenuItem
                                    sx={{ backgroundColor: bColors[1] }}
                                    onClick={() => { setInput('medium'); handleBackground(1); }}
                                    disableRipple
                                >
                                    Priority: Medium
                                </MenuItem>
                                <MenuItem
                                    sx={{ backgroundColor: bColors[2] }}
                                    onClick={() => { setInput('low'); handleBackground(2); }}
                                    disableRipple
                                >
                                    Priority: Low
                                </MenuItem>
                                <Divider sx={{ my: 0.5 }} />
                                <MenuItem
                                    sx={{ backgroundColor: bColors[3] }}
                                    onClick={() => { setInput('resolved'); handleBackground(3); }}
                                    disableRipple
                                >
                                    Status: Issue Resolved
                                </MenuItem>
                                <Divider sx={{ my: 0.5 }} />
                                <Button sx={{ ml: '30%' }} onClick={(event) => { handleClose(event); handleUpdateIssue(event); }}>Update</Button>
                            </StyledMenu>
                        </div>
                    </Alert>
                );
            })}
        </div>
    );
};

export default Issues;
