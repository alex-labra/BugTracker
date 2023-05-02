import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { Box, Container, Typography, TextField, Button, FormControl, RadioGroup, FormControlLabel, Radio, Grid, Link } from '@mui/material';
import api from './api';

const Registration = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('');
  
  const handleRegistration = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const response = await api.post('/register', { email, password, userType });
    return response.data;
  };

  const { mutate } = useMutation(handleRegistration, {
    onSuccess: (data) => {
      if (data.registration === true) {
        navigate('/login');
      } 
    },
    onError: (error) => {
      setError(error.response.data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    mutate();
  };

  return (
    <>
    {/* <Navbar /> */}
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FormControl component="fieldset" margin="normal">
            <RadioGroup aria-label="userType" name="userType" value={userType} onChange={(e) => setUserType(e.target.value)}>
              <FormControlLabel value="programmer" control={<Radio />} label="Programmer" />
              <FormControlLabel value="administrator" control={<Radio />} label="Administrator" />
            </RadioGroup>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Grid sx={{ml:'25%'}}>
            <Grid item>
              <Link href="/login" variant="body2">
                {"Already have an account? Login"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      </Container>
      </>
  );
};

export default Registration;

