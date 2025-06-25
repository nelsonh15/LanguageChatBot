// Message.js
import React, { useState, useEffect, memo } from 'react';
import { Box, Typography, Avatar, Paper, Tooltip, IconButton, Zoom, Fade } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import { handleTextToSpeech } from '../state/api.js';

interface MessageProps {
  message: any;
  canPlay: boolean;
  onPlayStateChange: (messageId: string, isPlaying: boolean) => void;
  previousMessageDate: { seconds: number; nanoseconds: number } | null;
  showTranslationTooltip: boolean;
  bubbleStyle: 'rounded' | 'square' | 'classic';
  textColorUser: string;
  textColorBot: string;
  bubbleColorUser: string;
  bubbleColorBot: string;
  fontSize: number;
  fontFamily: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

const Message: React.FC<MessageProps> = memo(({
  message,
  canPlay,
  onPlayStateChange,
  previousMessageDate,
  showTranslationTooltip,
  bubbleStyle = 'rounded',
  textColorUser = '#000000',
  textColorBot = '#000000',
  bubbleColorUser = '#E3F2FD',
  bubbleColorBot = '#F3E5F5',
  fontSize = 16,
  fontFamily,
  dateFormat,
  timeFormat = '12h'
}) => {
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
        hour: timeFormat === '24h' ? '2-digit' : 'numeric',
        minute: '2-digit',
        hour12: timeFormat === '12h'
      });
    } catch (error) {
      return 'Time unavailable';
    }
  };

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    try {
      const date = new Date(timestamp.seconds * 1000);
      switch (dateFormat) {
        case 'MM/DD/YYYY':
          return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          });
        case 'DD/MM/YYYY':
          return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
          });
        case 'YYYY-MM-DD':
          return date.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          });
        case 'Full Date Format':
          return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
      }
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

  const getBubbleStyle = (isBot: boolean) => {
    switch (bubbleStyle) {
      case 'square':
        return '5px';
      case 'classic':
        return isBot ? '20px 20px 20px 0' : '20px 20px 0 20px';
      default: // rounded
        return isBot ? '30px 30px 30px 30px' : '30px 30px 30px 30px';
    }
  };

  return (
    <>
      {shouldShowDate() && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, mt: 2 }}>
          <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', backgroundColor: 'background.paper', px: 2, py: 0.5, borderRadius: '15px' }}>
            {formatDate(message.addedAt)}
          </Typography>
        </Box>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isBot ? 'flex-start' : 'flex-end', mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: isBot ? 'row' : 'row-reverse', alignItems: 'end' }}>
          <Avatar sx={{ bgcolor: isBot ? 'primary.main' : 'secondary.main' }}>
            {isBot ? 'B' : 'U'}
          </Avatar>
          {showTranslationTooltip ? (
            <Tooltip title={<p style={{ color: 'white', fontSize: '15px' }}>{message.translated || ''}</p>} arrow placement={isBot ? 'right' : 'left'}>
              <Paper
                variant="outlined"
                sx={{
                  pr: 2,
                  pl: 2,
                  pt: 2,
                  pb: 0.5,
                  ml: isBot ? 1 : 0,
                  mr: isBot ? 0 : 1,
                  backgroundColor: isBot ? bubbleColorBot : bubbleColorUser,
                  borderRadius: getBubbleStyle(isBot),
                  minWidth: '6vw',
                  maxWidth: '60%',
                  position: 'relative',
                  ...(bubbleStyle === 'classic' && {
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      ...(isBot ? {
                        left: -8,
                        borderRight: `9px solid ${bubbleColorBot}`
                      } : {
                        right: -8,
                        borderLeft: `9px solid ${bubbleColorUser}`
                      }),
                      bottom: 10,
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      zIndex: 1
                    }
                  }),
                  ...(bubbleStyle === 'classic' && {
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      ...(isBot ? {
                        left: -9,
                        borderRight: '9px solid rgba(0, 0, 0, 0.10)'
                      } : {
                        right: -9,
                        borderLeft: '9px solid rgba(0, 0, 0, 0.10)'
                      }),
                      bottom: 10,
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      zIndex: 0
                    }
                  })
                }}>
                <Typography variant="body1" sx={{ fontSize: fontSize, fontFamily: fontFamily, color: isBot ? textColorBot : textColorUser }}>{message.content}</Typography>
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
                  <Typography sx={{ fontSize: '0.60rem', whiteSpace: 'nowrap', color: isBot ? textColorBot : textColorUser }}>{formatTime(message.addedAt)}</Typography>
                </Box>
              </Paper>
            </Tooltip>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                pr: 2,
                pl: 2,
                pt: 2,
                pb: 0.5,
                ml: isBot ? 1 : 0,
                mr: isBot ? 0 : 1,
                backgroundColor: isBot ? bubbleColorBot : bubbleColorUser,
                borderRadius: getBubbleStyle(isBot),
                minWidth: '6vw',
                maxWidth: '60%',
                position: 'relative',
                ...(bubbleStyle === 'classic' && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    ...(isBot ? {
                      left: -8,
                      borderRight: `9px solid ${bubbleColorBot}`
                    } : {
                      right: -8,
                      borderLeft: `9px solid ${bubbleColorUser}`
                    }),
                    bottom: 10,
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    zIndex: 1
                  }
                }),
                ...(bubbleStyle === 'classic' && {
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    ...(isBot ? {
                      left: -9,
                      borderRight: '9px solid rgba(0, 0, 0, 0.10)'
                    } : {
                      right: -9,
                      borderLeft: '9px solid rgba(0, 0, 0, 0.10)'
                    }),
                    bottom: 10,
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    zIndex: 0
                  }
                })
              }}>
              <Typography variant="body1" sx={{ fontSize: fontSize, fontFamily: fontFamily, color: isBot ? textColorBot : textColorUser }}>{message.content}</Typography>
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
                <Typography sx={{ fontSize: '0.60rem', whiteSpace: 'nowrap', color: isBot ? textColorBot : textColorUser }}>{formatTime(message.addedAt)}</Typography>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </>
  );
});

Message.displayName = 'Message';

export default Message;
