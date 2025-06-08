// Message.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Paper, Tooltip, IconButton } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { handleTextToSpeech } from '../state/api.js';

const Message = ({ message, canPlay, onPlayStateChange, previousMessageDate }) => {
  const isBot = message.role === 'assistant';
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioUrl && canPlay) {
      const audio = new Audio(audioUrl);
      audio.play();
      setIsPlaying(true); // Set playing state to true when audio starts

      audio.onended = () => {
        setIsPlaying(false); // Reset playing state when audio ends
        setAudioUrl(''); // Clear audio URL to allow for re-fetching if needed
      };

      audio.onplay = () => {
        setIsPlaying(true); // Ensure playing state is true when audio is played
      };

      audio.onerror = () => {
        setIsPlaying(false); // Reset playing state if an error occurs
      };
    }
  }, [audioUrl, canPlay]);

  useEffect(() => {
    return () => {
      if (isPlaying) {
        onPlayStateChange(message.id, false);
      }
    };
  }, [isPlaying]);

  const handleClick = async () => {
    if (!isPlaying && canPlay) { // Check if not already playing
      setLoading(true);
      await handleTextToSpeech(message.content, setAudioUrl);
      setLoading(false);
      onPlayStateChange(message.id, true);
    }
  };

  const formatTime = (timestamp: { seconds: number; nanoseconds: number }) => {
    try {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Time unavailable';
    }
  };

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    try {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  const shouldShowDate = () => {
    if (!previousMessageDate) return true;

    const currentDate = new Date(message.addedAt.seconds * 1000);
    const prevDate = new Date(previousMessageDate.seconds * 1000);

    return currentDate.toDateString() !== prevDate.toDateString();
  };

  return (
    <>
      {shouldShowDate() && (
        <Box sx={{ display: 'flex',justifyContent: 'center',mb: 2,mt: 2 }}>
          <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary',backgroundColor: 'background.paper', px: 2,py: 0.5,borderRadius: '15px'}}>
            {formatDate(message.addedAt)}
          </Typography>
        </Box>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isBot ? 'flex-start' : 'flex-end', mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: isBot ? 'row' : 'row-reverse', alignItems: 'end' }}>
          <Avatar sx={{ bgcolor: isBot ? 'primary.main' : 'secondary.main' }}>
            {isBot ? 'B' : 'U'}
          </Avatar>
          <Tooltip title={<p style={{ color: 'white', fontSize: '15px' }}>{message.translated || ''}</p>} placement={isBot ? 'right' : 'left'}>
            <Paper
              variant="outlined"
              sx={{
                pr: 2,
                pl: 2,
                pt: 2,
                pb: 0.5,
                ml: isBot ? 1 : 0,
                mr: isBot ? 0 : 1,
                backgroundColor: isBot ? 'primary.light' : 'secondary.light',
                borderRadius: isBot ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
                minWidth: '6vw',
                maxWidth: '60%',
              }}>
              <Typography variant="body1">{message.content}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton onClick={handleClick} disabled={loading || isPlaying}>
                  <PlayCircleOutlineIcon />
                </IconButton>
              </Box>
              <Box sx={{
                display: 'flex',
                justifyContent: isBot ? 'flex-end' : 'flex-start',
                color: 'text.secondary'
              }}>
                <Typography sx={{ fontSize: '0.60rem', whiteSpace: 'nowrap' }}>{formatTime(message.addedAt)}</Typography>
              </Box>
            </Paper>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
};

export default Message;
