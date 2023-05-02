import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import {AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import api from './api';
import ProjectForm from './ProjectForm';

const Navbar = ({isLoggedIn}) => {
  const navigate = useNavigate();
  const [userType, setUserType] = React.useState(null);

    //if logout do this
    const handleClick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/');
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{backgroundColor: 'black'}}>
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bug Tracker {isLoggedIn ? 'Dashboard' : ''}
          </Typography>
          <ProjectForm userType={userType} />
          {isLoggedIn ? <Button color="inherit" onClick={handleClick}>Logout</Button> :<>
          <Link to='/login'><Button sx={{color: 'white'}} variant="outlined">Login</Button></Link>
          <Link to='/registration'><Button sx={{color: 'white', ml:'10px'}} variant="outlined" >Register</Button></Link> 
          </>
          }
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar