import React, { useState, useRef } from "react";
import { Box, Button, Fade, Paper, Typography } from "@mui/material";
import { handleSpeechToText } from "../state/api";
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import IconButton from '@mui/material/IconButton';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';

interface SpeechToTextProps {
  onTranscriptChange: (transcript: string) => void;
}
const SpeechToText: React.FC<SpeechToTextProps> = ({ onTranscriptChange }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<PopperPlacementType>();

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }

    // Manage Popper visibility
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
    setPlacement('top');
  };

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

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        audioChunks.current = [];

        if (await isSilence(audioBlob)) {
          console.log("Audio contains silence, skipping transcription.");
        } else {
          transcribeAudio(audioBlob);
        }
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-1");
    const response = await handleSpeechToText(formData);
    setTranscript(response);
    onTranscriptChange(response.trim());
  };

  return (
    <div>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Typography sx={{ p: 2 }}>Recording...</Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
      <IconButton color="primary" size="medium" onClick={handleButtonClick}>
      <KeyboardVoiceOutlinedIcon />
      </IconButton >
    </div>
  );
};

export default SpeechToText;
