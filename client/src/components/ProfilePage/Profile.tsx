import React from 'react';
import { Box, Typography, Avatar, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Snackbar, Alert, useTheme } from '@mui/material';
import AccountManagement from './AccountManagement';
import StatsCards from './StatsCards';
import FeedbackSupport from './FeedbackSupport';

const mostActiveDays = ['Monday', 'Thursday'];

const Profile = ({ user }) => {
  const theme = useTheme();
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 6 }}>
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          minHeight: 260,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          mb: 6,
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Avatar
            src={user?.photoURL}
            sx={{ width: 110, height: 110, boxShadow: 4, border: '2px solid white' }}
          >
            {!user?.photoURL && user?.displayName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, letterSpacing: 1 }}>User Profile</Typography>
            <Typography variant="h6" sx={{ color: 'white', opacity: 0.85, mt: 1 }}>Welcome back, language explorer!</Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ maxWidth: 1400, mx: 'auto', px: 3 }}>
        <StatsCards />
        <AccountManagement />
        <FeedbackSupport />
      </Grid>
    </Box>
  );
};

export default Profile; 