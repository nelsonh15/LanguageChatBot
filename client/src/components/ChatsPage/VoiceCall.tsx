import { Box, IconButton, Typography, Paper, Avatar, Card, CardContent, CircularProgress } from '@mui/material'
import Vapi from '@vapi-ai/web';
import React, { useState, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { keyframes } from '@mui/system';

interface VoiceCallProps {
  apiKey: string;
  assistantId: string;
  config?: Record<string, unknown>;
  onClose: () => void;
  chatLanguage: string;
  translatedLanguage: string;
}

function VoiceCall({ apiKey, assistantId, config, onClose, chatLanguage, translatedLanguage }: VoiceCallProps) {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<Array<{ role: string, text: string }>>([]);
  const [showTranscript, setShowTranscript] = React.useState(false);
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = React.useState(false);
  const [error, setError] = useState('');
  const transcriptRef = React.useRef<HTMLDivElement>(null);

  // Define keyframes for speaking animation
  const speakingPulse = keyframes`
    0% {
      transform: scale(1);
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 8px 30px rgba(0,0,0,0.25);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
  `;

  useEffect(() => {
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);

    // Event listeners
    vapiInstance.on('call-start', () => {
      console.log('Call started');
      setIsConnected(true);
    });

    vapiInstance.on('call-end', () => {
      console.log('Call ended');
      setIsConnected(false);
      setIsSpeaking(false);
    });

    vapiInstance.on('speech-start', () => {
      console.log('Assistant started speaking');
      setIsSpeaking(true);
    });

    vapiInstance.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setIsSpeaking(false);
    });

    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript') {
        setTranscript(prev => [...prev, {
          role: message.role,
          text: message.transcript
        }]);
      }
    });

    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error);
    });

    return () => {
      vapiInstance?.stop();
    };
  }, [apiKey]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isConnected) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      setTimer(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isConnected]);

  // Auto-scroll to bottom when transcript updates
  useEffect(() => {
    if (transcriptRef.current && showTranscript) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript, showTranscript]);

  // Format timer to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async () => {
    try {
      setIsConnecting(true);
      setError('');
      if (vapi) {
        vapi.start(config);
      }
      setIsConnected(true);
    } catch (err) {
      setError('Failed to start voice call. Please try again.');
      console.error('Error starting VAPI session:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEndCall = async () => {
    if (vapi) {
      vapi.stop();
    }
    setIsConnected(false);
    onClose();
  };

  const toggleMute = () => {
    if (!vapi.isMuted()) {
      vapi.setMuted(true);
    }
    else {
      vapi.setMuted(false);
    }
    setIsMuted(!isMuted);
  };


  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        p: 3,
      }}
    >
      {/* Close button */}
      <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Main content area - takes remaining space */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        mb: 4, // Space for control panel
      }}>
        {/* Timer display */}
        {isConnected && (
          <Typography variant="h4" sx={{ color: 'white', mb: 2, fontFamily: 'monospace' }}>
            {formatTime(timer)}
          </Typography>
        )}

        {/* Two cards container */}
        <Box sx={{
          display: 'flex',
          gap: 4,
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center'
        }}>

          {/* Bot Card */}
          <Card
            sx={{
              width: 580,
              height: 320,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            <CardContent sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
              textAlign: 'center'
            }}>
              {/* Profile Picture Circle */}
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  backgroundColor: '#9c27b0',
                  border: '4px solid #fff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  animation: !isSpeaking ? `${speakingPulse} 1s infinite` : 'none'
                }}
              >
                <SmartToyIcon sx={{ fontSize: 60, color: 'white' }} />
              </Avatar>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                AI Assistant
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {isConnected ? 'Listening' : 'Waiting for call'}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Transcript Panel - Only show when call is active and transcript is enabled */}
        {isConnected && showTranscript && (
          <Paper
            sx={{
              width: '90%',
              maxWidth: 800,
              height: 200,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '2px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
            }}
          >
            <Box sx={{
              p: 2,
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Live Transcript
              </Typography>
            </Box>

            <Box
              ref={transcriptRef}
              sx={{
                height: 140,
                overflowY: 'auto',
                p: 2,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  },
                },
              }}
            >
              {transcript.map((msg, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                  }}>
                    {msg.role === 'bot' && (
                      <Avatar sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: '#9c27b0',
                        fontSize: '12px'
                      }}>
                        <SmartToyIcon sx={{ fontSize: 14 }} />
                      </Avatar>
                    )}

                    <Box sx={{
                      maxWidth: '70%',
                      backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f3e5f5',
                      borderRadius: 2,
                      p: 1.5,
                      border: `1px solid ${msg.role === 'user' ? '#bbdefb' : '#e1bee7'}`,
                    }}>
                      <Typography variant="body2" sx={{
                        fontWeight: 'medium',
                        color: msg.role === 'user' ? '#1976d2' : '#7b1fa2',
                        mb: 0.5
                      }}>
                        {msg.role === 'user' ? 'You' : 'AI Assistant'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {msg.text}
                      </Typography>

                    </Box>

                    {msg.role === 'user' && (
                      <Avatar sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: '#1976d2',
                        fontSize: '12px'
                      }}>
                        <PersonIcon sx={{ fontSize: 14 }} />
                      </Avatar>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        )}
      </Box>

      {/* Fixed Control Panel at Bottom */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        position: 'sticky',
        bottom: 0,
        pt: 2,
      }}>
        {/* Call controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {!isConnected ? (
            <IconButton
              onClick={handleStartCall}
              sx={{
                backgroundColor: '#4caf50',
                color: 'white',
                width: 80,
                height: 80,
                '&:hover': {
                  backgroundColor: '#45a049',
                },
              }}
            >
              <PhoneInTalkIcon sx={{ fontSize: 40 }} />
            </IconButton>
          ) : (
            <Paper
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                p: 2,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <IconButton
                onClick={toggleMute}
                sx={{
                  backgroundColor: isMuted ? '#f44336' : '#2196f3',
                  color: 'white',
                  width: 60,
                  height: 60,
                  '&:hover': {
                    backgroundColor: isMuted ? '#d32f2f' : '#1976d2',
                  },
                }}
              >
                {isMuted ? <MicOffIcon sx={{ fontSize: 24 }} /> : <MicIcon sx={{ fontSize: 24 }} />}
              </IconButton>

              <IconButton
                onClick={() => setShowTranscript(!showTranscript)}
                sx={{
                  backgroundColor: showTranscript ? '#ff9800' : '#9e9e9e',
                  color: 'white',
                  width: 60,
                  height: 60,
                  '&:hover': {
                    backgroundColor: showTranscript ? '#f57c00' : '#757575',
                  },
                }}
              >
                {showTranscript ? <ChatIcon sx={{ fontSize: 24 }} /> : <ChatBubbleOutlineIcon sx={{ fontSize: 24 }} />}
              </IconButton>

              <IconButton
                onClick={handleEndCall}
                sx={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  width: 60,
                  height: 60,
                  '&:hover': {
                    backgroundColor: '#d32f2f',
                  },
                }}
              >
                <CallEndIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Status text */}
      <Typography variant="body1" sx={{ color: 'white', mt: 3, textAlign: 'center' }}>
        {isConnected
          ? ''
          : isConnecting
            ? `Connecting to voice service in ${chatLanguage}...`
            : error
              ? error
              : `Click the green button to start a voice conversation in ${chatLanguage}`
        }
      </Typography>

      {/* Error message */}
      {error && (
        <Typography variant="body2" sx={{ color: '#ff6b6b', mt: 1, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      {/* Loading indicator */}
      {isConnecting && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      )}
    </Box>
  )
}

export default VoiceCall