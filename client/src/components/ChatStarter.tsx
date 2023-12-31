import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const ChatStarter: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    text: {
      fontSize: isMobile ? '1.5rem' : '2rem',
      color: '#333',
      marginBottom: theme.spacing(2),
    },
    icon: {
      fontSize: '3rem',
      color: '#1565C0',
      marginBottom: theme.spacing(1),
      animation: 'pulse 2s infinite',
    },
    '@keyframes pulse': {
      '0%': {
        transform: 'scale(1)',
      },
      '50%': {
        transform: 'scale(1.1)',
      },
      '100%': {
        transform: 'scale(1)',
      },
    },
  };

  return (
    <Box sx={styles.container}>
      <ChatBubbleOutlineIcon sx={styles.icon} />
      <Typography variant="h5" sx={styles.text}>
        Create a new message to start chatting
      </Typography>
    </Box>
  );
};

export default ChatStarter;
