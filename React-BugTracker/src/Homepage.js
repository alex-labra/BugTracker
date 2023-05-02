import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Navbar from './Navbar';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';

const Homepage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: isSmallScreen ? 'column-reverse' : 'row',
          mt: {xs:35, sm:15, md:5, lg:0},

        }}
      >
        <Box sx={{ width: isSmallScreen ? '100%' : '50%', display: 'flex', justifyContent: 'center',  }}>
          <Card
            sx={{
              maxWidth: '100%',
              borderRadius: 60,
              alignSelf: isSmallScreen ? 'center' : 'flex-end',
            }}
          >
            <CardMedia component="img" alt="logo" height="100%" image={require('./media/logo.gif')} />
          </Card>
        </Box>
        <Box
          sx={{
            width: isSmallScreen ? '100%' : '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            m: '1.5rem'
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Welcome to your Bug Tracking App
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Are you tired of managing bug reports manually? Do you find it difficult to keep track of bugs reported by your team?
            Look no further! Our Bug Tracking App is here to help.
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            With our app, you can easily report and track bugs in one central location. Our intuitive interface makes it easy for anyone
            on your team to report a bug, including detailed descriptions. Plus, our app automatically assigns each bug to the
            appropriate team member, so you can rest assured that every issue is being addressed.
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            But that's not all! Our app also allows you to prioritize and categorize bugs, making it easy to focus on the most critical
            issues first.
          </Typography>
          <Button variant="contained" size="large" color="primary" href="/registration" sx={{mb:{xs:5}}}>
            Try our Bug Tracking App today
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Homepage;
