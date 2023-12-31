// Message.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Paper, Tooltip, IconButton } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { handleTextToSpeech } from '../state/api.js';

const Message = ({ message }) => {
  const isBot = message.role === 'assistant';
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      setAudioUrl('');
    }
  }, [audioUrl])

  const handleClick = async () => {
    setLoading(true);
    handleTextToSpeech(message.content, setAudioUrl);
    setLoading(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isBot ? 'flex-start' : 'flex-end', mb: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: isBot ? 'row' : 'row-reverse', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: isBot ? 'primary.main' : 'secondary.main' }}>
          {isBot ? 'B' : 'U'}
        </Avatar>
        <Tooltip title={<p style={{ color: 'white', fontSize: '15px' }}>{message.translated || ''}</p>} placement={isBot ? 'right' : 'left'}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              ml: isBot ? 1 : 0,
              mr: isBot ? 0 : 1,
              backgroundColor: isBot ? 'primary.light' : 'secondary.light',
              borderRadius: isBot ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
              maxWidth: '60%',
            }}>
            <Typography variant="body1">{message.content}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center'}}>
              <IconButton onClick={handleClick} disabled={loading}>
                <PlayCircleOutlineIcon />
              </IconButton>
            </Box>
          </Paper>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Message;
