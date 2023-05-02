import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from 'react-query';
import { Box, Container, Typography, Avatar, TextField, Button, Grid, Link, } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import api from "./api";
import Navbar from './Navbar';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await api.post('/authenticate', { email, password });
    return response.data;
  };

  const { mutate, isLoading } = useMutation(handleLogin, {
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);
      navigate('/dashboard');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Typography>Loading...</Typography>
      </>
    );
  }

  return (
    <Container component="main" maxWidth="xs" >
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/registration" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
