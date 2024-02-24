import React from 'react';
import { Box, Button, FormGroup, FormControlLabel, FormControl, Switch, Typography } from "@mui/material";

function Settings({ autoPlay, setAutoPlay }) {
  const handleAutoPlayChange = (event) => {
    setAutoPlay(event.target.checked);
  };

  return (
    <Box sx={{
      height: "91vh",
      width: "16%",
      display: "flex",
      flexDirection: "column",
      bgcolor: "grey.300",
      border: '2px solid #4682B4',
      overflow: 'auto'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '1vw' }} >
        <Typography sx={{fontSize: '1.25vw'}} variant="h4"> Message Settings </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <FormControl component="fieldset">
          <FormGroup aria-label="position" row>
            <FormControlLabel
              value="top"
              control={<Switch checked={autoPlay} onChange={handleAutoPlayChange} />}
              label="Auto-play chatbot's messages"
              labelPlacement="top"
            />
          </FormGroup>
        </FormControl>
      </Box>
    </Box>
  )
}

export default Settings