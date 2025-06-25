import React, { useState, useRef } from "react";
import {
  Box,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  Fab
} from "@mui/material";
import { handleSpeechToText } from "../state/api";
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import StopCircleIcon from '@mui/icons-material/StopCircle';

interface SpeechToTextProps {
  onTranscriptChange: (transcript: string) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTranscriptChange }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);

  const isSilence = async (audioBlob: Blob): Promise<boolean> => {
    const audioContext = new AudioContext();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const rawData = audioBuffer.getChannelData(0);
    const total = rawData.reduce((sum, value) => sum + Math.abs(value), 0);
    const averageVolume = total / rawData.length;
    const silenceThreshold = 0.01;
    return averageVolume < silenceThreshold;
  };

  const startRecording = async () => {
    setTranscript("");
    onTranscriptChange("");
    setIsRecording(true);
    setSnackbar({ open: true, message: "Recording started", severity: 'info' });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunks.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        audioChunks.current = [];
        if (await isSilence(audioBlob)) {
          setSnackbar({ open: true, message: "No speech detected. Please try again.", severity: 'info' });
        } else {
          setLoading(true);
          await transcribeAudio(audioBlob);
          setLoading(false);
        }
      };
      mediaRecorderRef.current.start();
    } catch (error) {
      setSnackbar({ open: true, message: "Error accessing microphone", severity: 'error' });
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
    setSnackbar({ open: true, message: "Recording stopped", severity: 'info' });
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-1");
    try {
      const response = await handleSpeechToText(formData);
      setTranscript(response);
      onTranscriptChange(response.trim());
      setSnackbar({ open: true, message: "Transcription complete", severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: "Transcription failed", severity: 'error' });
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Tooltip title={isRecording ? "Stop Recording" : "Start Recording"} placement="top">
        <span>
          <Fab
            size="small" 
            color={isRecording ? "error" : "primary"}
            onClick={handleMicClick}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            disabled={loading}
            sx={{ position: 'relative', boxShadow: 3 }}
          >
            {isRecording ? <StopCircleIcon fontSize="small" /> : <KeyboardVoiceOutlinedIcon fontSize="small" />}
            
          </Fab>
        </span>
      </Tooltip>
      {loading && <CircularProgress size={32} color="primary" />}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SpeechToText;
