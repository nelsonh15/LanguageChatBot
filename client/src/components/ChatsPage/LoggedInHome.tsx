import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, TextField, Button, Grid, IconButton, Paper, Tooltip, Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import SendIcon from "@mui/icons-material/Send";
import Chats from "./Chats";
import Message from "./Message";
import { addChat, deleteChat, addMessages, updateChatName, updateUserSettings, getUserSettings } from "../../firebase";
import ChatStarter from "./ChatStarter";
import VoiceCall from "./VoiceCall";
import LanguageDialog from "./LanguageDialog";
import Settings from "./Settings";
import { translatedText, handleTextToSpeech, chatCompletion } from "../../state/api";
import SpeechToText from "./SpeechToText";
import { User } from 'firebase/auth';

interface LoggedInHomeProps {
  handleSubmit: () => void;
  user: User;
  chats: Record<string, any>;
  setChats: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  settings: any[];
  setUserSettings: React.Dispatch<React.SetStateAction<any[]>>;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LoggedInHome = ({ handleSubmit, user, chats, setChats, settings, setUserSettings }: LoggedInHomeProps) => {
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const sendButtonref = useRef<HTMLButtonElement | null>(null);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLanguage, setChatLanguage] = useState(null);
  const [chatTranslatedLang, setChatTranslatedLang] = useState(null);
  const [messages, setMessages] = useState([{ content: "", role: 'system' }]);
  const [currentlyPlayingMessageId, setCurrentlyPlayingMessageId] = useState(null);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [settingsPreview, setSettingsPreview] = useState(settings[0]);
  const [showVoiceCall, setShowVoiceCall] = useState(false);

  useEffect(() => {
    if (settings[0] && !hasUnsavedChanges) {
      setSettingsPreview(settings[0]);
    }
  }, [settings]);

  // Deep compare settingsPreview and settings[0] to determine unsaved changes
  const hasUnsavedChanges = settings[0] && settingsPreview && JSON.stringify(settingsPreview) !== JSON.stringify(settings[0]);

  useEffect(() => {
    if (hasUnsavedChanges) {
      setSnackbar({ open: true, message: 'Changes not saved', severity: 'warning' });
    }
  }, [hasUnsavedChanges]);

  // Use settingsPreview for all settings values
  const fontSize = settingsPreview?.fontSize ?? 16;
  const fontFamily = settingsPreview?.fontFamily ?? 'Arial';
  const bubbleStyle = settingsPreview?.bubbleStyle ?? 'rounded';
  const textColorUser = settingsPreview?.textColorUser ?? '#000000';
  const textColorBot = settingsPreview?.textColorBot ?? '#000000';
  const bubbleColorUser = settingsPreview?.bubbleColorUser ?? '#E3F2FD';
  const bubbleColorBot = settingsPreview?.bubbleColorBot ?? '#F3E5F5';
  const dateFormat = settingsPreview?.dateFormat ?? 'MM/DD/YYYY';
  const timeFormat = settingsPreview?.timeFormat ?? '12h';
  const autoPlay = settingsPreview?.autoPlay ?? false;
  const showTranslationTooltip = settingsPreview?.showTranslationTooltip ?? false;

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(null);
  };

  // Memoize the settings state object
  const settingsState = React.useMemo(() => ({
    autoPlay,
    setAutoPlay: (v) => setSettingsPreview(prev => ({ ...prev, autoPlay: v })),
    showTranslationTooltip,
    setShowTranslationTooltip: (v) => setSettingsPreview(prev => ({ ...prev, showTranslationTooltip: v })),
    isExpanded: settingsExpanded,
    onToggle: () => setSettingsExpanded(!settingsExpanded),
    fontSize,
    setFontSize: (v) => setSettingsPreview(prev => ({ ...prev, fontSize: v })),
    fontFamily,
    setFontFamily: (v) => setSettingsPreview(prev => ({ ...prev, fontFamily: v })),
    bubbleStyle,
    setBubbleStyle: (v) => setSettingsPreview(prev => ({ ...prev, bubbleStyle: v })),
    textColorUser,
    setTextColorUser: (v) => setSettingsPreview(prev => ({ ...prev, textColorUser: v })),
    textColorBot,
    setTextColorBot: (v) => setSettingsPreview(prev => ({ ...prev, textColorBot: v })),
    bubbleColorUser,
    setBubbleColorUser: (v) => setSettingsPreview(prev => ({ ...prev, bubbleColorUser: v })),
    bubbleColorBot,
    setBubbleColorBot: (v) => setSettingsPreview(prev => ({ ...prev, bubbleColorBot: v })),
    dateFormat,
    setDateFormat: (v) => setSettingsPreview(prev => ({ ...prev, dateFormat: v })),
    timeFormat,
    setTimeFormat: (v) => setSettingsPreview(prev => ({ ...prev, timeFormat: v })),
  }), [
    autoPlay,
    showTranslationTooltip,
    settingsExpanded,
    fontSize,
    fontFamily,
    bubbleStyle,
    textColorUser,
    textColorBot,
    bubbleColorUser,
    bubbleColorBot,
    dateFormat,
    timeFormat,
  ]);

  useEffect(() => {
    async function loadMessages() {
      if (user && currentChatId) {
        setMessages(chats[currentChatId].messages);
        setChatLanguage(chats[currentChatId].language)
        setChatTranslatedLang(chats[currentChatId].translatedLanguage)
      }
    };
    loadMessages();
  }, [user, currentChatId, chats]);

  useEffect(() => {
    if (currentChatId !== null && chats[currentChatId]?.messages.length) {
      chatBoxRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChatId, chats]);

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().then(() => {
        // This will be executed after the audio is played
        setAudioUrl(''); // Reset the audioUrl state to allow for the next message to play
      }).catch(error => {
        console.error("Error playing the audio", error);
      });
    }
  }, [audioUrl, autoPlay]);

  const deleteChatHandler = async (chatId: string) => {
    const deleted = await deleteChat(user, chatId);
    if (deleted) {
      const updatedChats = { ...chats };
      delete updatedChats[chatId];
      setChats(updatedChats);

      // Update currentChatId if the deleted chat was the current chat
      if (currentChatId === chatId) {
        const remainingChatIds = Object.keys(updatedChats);
        setCurrentChatId(remainingChatIds.length > 0 ? remainingChatIds[0] : null);
      }
    } else {
      console.error("Error deleting chat.");
    }
  };

  const handleSend = async () => {
    if (input.trim() !== "") {
      const translatedUserText = await translatedText(input, chatLanguage, chatTranslatedLang)
      const userTimestamp = await addMessages(user, currentChatId, chats[currentChatId].messages.length + 1, "user", input, translatedUserText)
      const newMessage = {
        chatID: currentChatId,
        id: chats[currentChatId].messages.length + 1,
        content: input,
        role: "user",
        translated: translatedUserText,
        addedAt: userTimestamp.addedAt,
        createdBy: userTimestamp.createdBy,
        createdBy_userID: userTimestamp.createdBy_userID
      };

      const updatedChats = { ...chats };
      updatedChats[currentChatId].messages.push(newMessage);
      setChats(updatedChats);

      setInput("");
      setLoading(true);

      const aiText = await chatCompletion(messages, chatLanguage)
      const translatedAIText = await translatedText(aiText, chatLanguage, chatTranslatedLang)
      const aiTimestamp = await addMessages(user, currentChatId, chats[currentChatId].messages.length + 1, "assistant", aiText, translatedAIText)
      const newAIMessage = {
        chatID: currentChatId,
        id: chats[currentChatId].messages.length + 1,
        content: aiText,
        role: "assistant",
        translated: translatedAIText,
        addedAt: aiTimestamp.addedAt,
        createdBy: aiTimestamp.createdBy,
        createdBy_userID: aiTimestamp.createdBy_userID
      };
      const updatedChats2 = { ...chats };
      updatedChats2[currentChatId].messages.push(newAIMessage);
      setChats(updatedChats2);

      if (autoPlay) {
        handleTextToSpeech(aiText, setAudioUrl);
      }
      setLoading(false);
    }
  };

  const handleLanguageDialogSubmit = async (chatName, language, translatedLang) => {
    if (user) {
      const newChatAndID = await addChat(user, chatName, language, translatedLang);

      if (newChatAndID !== null) {
        const newChatId = newChatAndID[0];
        const newChat = newChatAndID[1];
        // Add the new chat to the list of chats
        setChats({ ...chats, [String(newChatId)]: newChat });

        // Set the new chat as the current chat
        setCurrentChatId(newChatId);
      }
    }
  };

  // Memoize event handlers
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  }, []);

  const handlePlayStateChange = useCallback((messageId: string, isPlaying: boolean) => {
    if (isPlaying) {
      setCurrentlyPlayingMessageId(messageId);
    } else if (currentlyPlayingMessageId === messageId) {
      setCurrentlyPlayingMessageId(null);
    }
  }, [currentlyPlayingMessageId]);

  const keyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (handleSubmit) {
        handleSubmit();
      }
      if (sendButtonref.current) {
        sendButtonref.current.click();
      }
    }
  }, [handleSubmit]);

  const handleNewChatClick = async () => {
    setShowLanguageDialog(true);
  };

  const switchChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  const handleTranscriptChange = (newTranscript: string) => {
    setInput(newTranscript.trim());
  };

  const handleRenameChat = async (chatId: string, newName: string) => {
    const success = await updateChatName(user, chatId, newName);
    if (success) {
      const updatedChats = { ...chats };
      updatedChats[chatId] = {
        ...updatedChats[chatId],
        chat: newName
      };
      setChats(updatedChats);
    }
  };

  // Function to get voice configuration based on chat language
  const getVoiceConfig = (language: string) => {
    return {
      name: "Language Chatbot",
      firstMessage: "hej hej. hur mår du idag? vad heter du? är du svensk eller vad",
      firstMessageInterruptionsEnabled: false,
      firstMessageMode: "assistant-speaks-first",
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: `Only speak ${language} to the user` }],
      },
      voice: {
        provider: "openai",
        voiceId: "Nova"
      },
      transcriber: {
        language: `${language}`,
        provider: "google",
        model: 'gemini-2.0-flash',
      },

      backgroundSpeechDenoisingPlan: {
        smartDenoisingPlan: {
          enabled: true
        },
      },
      startSpeakingPlan: {
        transcriptionEndpointingPlan: {
          onPunctuationSeconds: 0.1,
          onNoPunctuationSeconds: 1.5,
          onNumberSeconds: 0.5
        },
        waitSeconds: 0.4
      },
      stopSpeakingPlan: {
        numWords: 0,
        voiceSeconds: 0.2,
        backoffSeconds: 1.0
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", margin: 0, padding: 0, height: "100vh", width: "100%" }}>
      <Box sx={{
        height: "100vh",
        width: "18vw",
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey.300",
        border: '2px solid #4682B4',
        overflow: 'auto'
      }}>
        <LanguageDialog open={showLanguageDialog} onClose={() => setShowLanguageDialog(false)} onSubmit={handleLanguageDialogSubmit} />
        <Chats
          chats={chats}
          deleteChatHandler={deleteChatHandler}
          switchChat={switchChat}
          handleNewChatClick={handleNewChatClick}
          currentChatId={currentChatId}
          onRenameChat={handleRenameChat}
        />
      </Box>

      {currentChatId !== null ? (
        <Box sx={{
          height: "100vh",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "grey.300",
          border: '2px solid #4682B4'
        }}>
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              bgcolor: "rgba(255, 255, 255, 0.8)",
              p: 0.71,
              borderBottom: '1px solid rgba(70, 130, 180, 0.3)',
              backdropFilter: "blur(8px)"
            }}
          >
            {/* Message panel content */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}>
              <Tooltip title="Voice Call" arrow placement="bottom">
                <IconButton onClick={() => setShowVoiceCall(true)}>
                  <PhoneInTalkIcon fontSize="large" color="primary" />
                </IconButton>
              </Tooltip>
            </Box>

          </Box>

          <Box sx={{ flexGrow: 1, overflow: "auto", p: 2, position: "relative" }}>
            {/* Render messages based on the current chat */}
            {currentChatId !== null && chats[currentChatId] && (
              chats[currentChatId].messages.map((message, index) => (
                <Message
                  key={`${currentChatId}-${message.id}`}
                  message={message}
                  user={user}
                  canPlay={currentlyPlayingMessageId === null || currentlyPlayingMessageId === message.id}
                  onPlayStateChange={handlePlayStateChange}
                  previousMessageDate={index > 0 ? chats[currentChatId].messages[index - 1].addedAt : null}
                  showTranslationTooltip={showTranslationTooltip}
                  bubbleStyle={bubbleStyle}
                  textColorUser={textColorUser}
                  textColorBot={textColorBot}
                  bubbleColorUser={bubbleColorUser}
                  bubbleColorBot={bubbleColorBot}
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                  dateFormat={dateFormat}
                  timeFormat={timeFormat}
                />
              ))
            )}
            <div ref={chatBoxRef} />
          </Box>

          <Box sx={{ p: 2, backgroundColor: "background.default", borderTop: '2px solid #4682B4' }}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs={10}>
                <TextField size="small" fullWidth placeholder="Type a message" variant="outlined" value={input} onChange={handleInputChange} onKeyDown={keyPress} />
              </Grid>

              <Grid item xs="auto">
                <SpeechToText onTranscriptChange={handleTranscriptChange} />
              </Grid>
              <Grid item xs>
                <Button ref={sendButtonref} fullWidth color="primary" variant="contained" endIcon={<SendIcon />} onClick={handleSend} disabled={loading}>
                  Send
                </Button>
              </Grid>
            </Grid>
          </Box>

        </Box>
      ) : (
        <Box sx={{
          height: "100vh",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "grey.300",
          border: '2px solid #4682B4'
        }}>
          <ChatStarter />
        </Box>
      )}
      <Settings
        {...settingsState}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={async () => {
          const success = await updateUserSettings(user, settingsPreview);
          if (success) {
            // Optimistically update the state to disable the save button immediately
            setUserSettings([settingsPreview]);
            setSnackbar({ open: true, message: 'Settings saved!', severity: 'success' });
          } else {
            setSnackbar({ open: true, message: 'Failed to save settings.', severity: 'error' });
          }
        }}
      />
      {showVoiceCall && (
        <VoiceCall
          apiKey={import.meta.env.VITE_VAPI_API_KEY}
          assistantId={import.meta.env.VITE_VAPI_ASSISTANT_ID}
          config={getVoiceConfig(chatLanguage)}
          onClose={() => setShowVoiceCall(false)}
          chatLanguage={chatLanguage}
          translatedLanguage={chatTranslatedLang}
        />
        // <VapiWidget apiKey={import.meta.env.VITE_VAPI_API_KEY} assistantId={import.meta.env.VITE_VAPI_ASSISTANT_ID} />
      )}
      {snackbar && (
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default LoggedInHome;
