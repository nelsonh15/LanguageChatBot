import React, { useCallback, memo } from 'react';
import {
  Box,
  FormGroup,
  FormControlLabel,
  FormControl,
  Switch,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Slider,
  RadioGroup,
  Radio,
  Divider,
  InputLabel,
  Stack,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  alpha,
  Button,
} from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaletteIcon from '@mui/icons-material/Palette';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TuneIcon from '@mui/icons-material/Tune';

interface SettingsProps {
  autoPlay: boolean;
  setAutoPlay: (value: boolean) => void;
  showTranslationTooltip: boolean;
  setShowTranslationTooltip: (value: boolean) => void;
  isExpanded: boolean;
  onToggle: () => void;
  fontSize: number;
  setFontSize: (value: number) => void;
  fontFamily: string;
  setFontFamily: (value: string) => void;
  bubbleStyle: 'rounded' | 'square' | 'classic';
  setBubbleStyle: (value: 'rounded' | 'square' | 'classic') => void;
  textColorUser: string;
  setTextColorUser: (value: string) => void;
  textColorBot: string;
  setTextColorBot: (value: string) => void;
  bubbleColorUser: string;
  setBubbleColorUser: (value: string) => void;
  bubbleColorBot: string;
  setBubbleColorBot: (value: string) => void;
  dateFormat: string;
  setDateFormat: (value: string) => void;
  timeFormat: '12h' | '24h';
  setTimeFormat: (value: '12h' | '24h') => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
}

const Settings = memo(function Settings({
  autoPlay,
  setAutoPlay,
  showTranslationTooltip,
  setShowTranslationTooltip,
  isExpanded,
  onToggle,
  fontSize = 16,
  setFontSize,
  fontFamily = 'Arial',
  setFontFamily,
  bubbleStyle = 'rounded',
  setBubbleStyle,
  textColorUser = '#000000',
  setTextColorUser,
  textColorBot = '#000000',
  setTextColorBot,
  bubbleColorUser = '#E3F2FD',
  setBubbleColorUser,
  bubbleColorBot = '#F3E5F5',
  setBubbleColorBot,
  dateFormat = 'MM/DD/YYYY',
  setDateFormat,
  timeFormat = '12h',
  setTimeFormat,
  onSave,
  hasUnsavedChanges
}: SettingsProps) {
  const fontFamilies = ['Arial', 'Montserrat', 'Open Sans', 'Roboto', 'Segoe UI', 'Verdana'];
  const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'Full Date Format'];

  const handleFontSizeChange = useCallback((_, value) => {
    setFontSize(value);
  }, [setFontSize]);

  const handleFontFamilyChange = useCallback((e) => {
    setFontFamily(e.target.value);
  }, [setFontFamily]);

  const handleBubbleStyleChange = useCallback((e) => {
    setBubbleStyle(e.target.value);
  }, [setBubbleStyle]);

  const handleTextColorUserChange = useCallback((e) => {
    setTextColorUser(e.target.value);
  }, [setTextColorUser]);

  const handleBubbleColorUserChange = useCallback((e) => {
    setBubbleColorUser(e.target.value);
  }, [setBubbleColorUser]);

  const handleTextColorBotChange = useCallback((e) => {
    setTextColorBot(e.target.value);
  }, [setTextColorBot]);

  const handleBubbleColorBotChange = useCallback((e) => {
    setBubbleColorBot(e.target.value);
  }, [setBubbleColorBot]);

  const handleDateFormatChange = useCallback((e) => {
    setDateFormat(e.target.value);
  }, [setDateFormat]);

  const handleTimeFormatChange = useCallback((e) => {
    setTimeFormat(e.target.value);
  }, [setTimeFormat]);

  const handleAutoPlayChange = useCallback((e) => {
    setAutoPlay(e.target.checked);
  }, [setAutoPlay]);

  const handleTranslationTooltipChange = useCallback((e) => {
    setShowTranslationTooltip(e.target.checked);
  }, [setShowTranslationTooltip]);

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100vh",
        width: isExpanded ? "350px" : "50px",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        transition: 'width 0.3s ease-in-out',
        borderRadius: 0,
        overflow: 'hidden',
      }}>
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
      }}>
        <IconButton onClick={onToggle} size="small" sx={{ mr: 1 }}>
          {isExpanded ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
        {isExpanded && (
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Settings
          </Typography>
        )}
      </Box>

      {isExpanded && (
        <Box sx={{
          flexGrow: 1,
          overflow: 'auto',
          px: 2,
          py: 1,
          '& .MuiAccordion-root': {
            '&:before': {
              display: 'none',
            },
            boxShadow: 'none',
            bgcolor: 'transparent',
          }
        }}>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                minHeight: 56,
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center'
                }
              }}
            >
              <TextFieldsIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight={500}>
                Typography
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                <Box>
                  <Typography id="font-size-slider" variant="body2" gutterBottom>Font Size</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ fontSize: '1rem' }}>A</Typography>
                    <Slider
                      value={fontSize}
                      onChange={handleFontSizeChange}
                      min={12}
                      max={24}
                      aria-labelledby="font-size-slider"
                      size="small"
                    />
                    <Typography sx={{ fontSize: '2rem' }}>A</Typography>
                  </Stack>
                </Box>
                <FormControl size="small">
                  <InputLabel>Font Family</InputLabel>
                  <Select
                    value={fontFamily}
                    onChange={handleFontFamilyChange}
                    label="Font Family"
                  >
                    {fontFamilies.map((font) => (
                      <MenuItem key={font} value={font}>{font}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                minHeight: 56,
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center'
                }
              }}
            >
              <ChatBubbleOutlineIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight={500}>
                Chat Bubbles
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                <FormControl>
                  <Typography variant="body2" gutterBottom>Bubble Shape</Typography>
                  <RadioGroup
                    value={bubbleStyle}
                    onChange={handleBubbleStyleChange}
                  >
                    <FormControlLabel
                      value="rounded"
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2">Rounded</Typography>
                      }
                    />
                    <FormControlLabel
                      value="square"
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2">Square</Typography>
                      }
                    />
                    <FormControlLabel
                      value="classic"
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2">Classic</Typography>
                      }
                    />
                  </RadioGroup>
                </FormControl>
                <Box>
                  <Typography variant="body2" gutterBottom>User Message Text Color</Typography>
                  <TextField
                    type="color"
                    value={textColorUser}
                    onChange={handleTextColorUserChange}
                    fullWidth
                    size="small"
                    sx={{
                      '& input': {
                        height: '40px',
                        cursor: 'pointer'
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" gutterBottom>User Bubble Color</Typography>
                  <TextField
                    type="color"
                    value={bubbleColorUser}
                    onChange={handleBubbleColorUserChange}
                    fullWidth
                    size="small"
                    sx={{
                      '& input': {
                        height: '40px',
                        cursor: 'pointer'
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" gutterBottom>Bot Message Text Color</Typography>
                  <TextField
                    type="color"
                    value={textColorBot}
                    onChange={handleTextColorBotChange}
                    fullWidth
                    size="small"
                    sx={{
                      '& input': {
                        height: '40px',
                        cursor: 'pointer'
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" gutterBottom>Bot Bubble Color</Typography>
                  <TextField
                    type="color"
                    value={bubbleColorBot}
                    onChange={handleBubbleColorBotChange}
                    fullWidth
                    size="small"
                    sx={{
                      '& input': {
                        height: '40px',
                        cursor: 'pointer'
                      }
                    }}
                  />
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                minHeight: 56,
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center'
                }
              }}
            >
              <CalendarMonthIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight={500}>
                Time & Date Format
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                <FormControl size="small">
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={dateFormat}
                    onChange={handleDateFormatChange}
                    label="Date Format"
                  >
                    {dateFormats.map((format) => (
                      <MenuItem key={format} value={format}>{format}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <Typography variant="body2" gutterBottom>Time Format</Typography>
                  <RadioGroup
                    row
                    value={timeFormat}
                    onChange={handleTimeFormatChange}
                    sx={{
                      justifyContent: 'flex-start',
                      gap: 2
                    }}
                  >
                    <FormControlLabel
                      value="12h"
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2">12-hour</Typography>
                      }
                    />
                    <FormControlLabel
                      value="24h"
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2">24-hour</Typography>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                minHeight: 56,
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center'
                }
              }}
            >
              <TuneIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight={500}>
                Other Settings
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl component="fieldset">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoPlay}
                        onChange={handleAutoPlayChange}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">Auto-play chatbot's messages</Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showTranslationTooltip}
                        onChange={handleTranslationTooltipChange}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">Show translation tooltip</Typography>
                    }
                  />
                </FormGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
            <Button variant="contained" disabled={!hasUnsavedChanges} onClick={onSave}>Save</Button>
          </Box>

        </Box>

      )}

    </Paper>
  );
});

export default Settings;