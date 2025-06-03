import React from 'react';
import { Box, FormGroup, FormControlLabel, FormControl, Switch, Typography, IconButton } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

function Settings({ autoPlay, setAutoPlay, isExpanded, onToggle }) {
  const handleAutoPlayChange = (event) => {
    setAutoPlay(event.target.checked);
  };

  return (
    <Box sx={{
      height: "100vh",
      width: isExpanded ? "250px" : "50px",
      display: "flex",
      flexDirection: "column",
      bgcolor: "grey.300",
      border: '2px solid #4682B4',
      borderLeft: '2px solid #4682B4',
      overflow: 'hidden',
      transition: 'width 0.3s ease-in-out'
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 1,
      }}>
        <IconButton onClick={onToggle} size="small">
          {isExpanded ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
        {isExpanded && (
          <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
            Settings
          </Typography>
        )}
      </Box>

      {isExpanded && (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1
        }}>
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={autoPlay} onChange={handleAutoPlayChange} />}
                label="Auto-play chatbot's messages"
                labelPlacement="top"
              />
            </FormGroup>
          </FormControl>
        </Box>
      )}
    </Box>
  );
}

export default Settings