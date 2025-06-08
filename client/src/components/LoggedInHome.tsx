import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Grid, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SettingsIcon from "@mui/icons-material/Settings";
import Chats from "./Chats";
import Message from "./Message";
import { addChat, deleteChat, addMessages, updateChatName } from "../firebase";
import ChatStarter from "./ChatStarter";
import LanguageDialog from "./LanguageDialog";
import Settings from "./Settings";
import { translatedText, handleTextToSpeech, chatCompletion } from "../state/api";
import SpeechToText from "./SpeechToText";
import { User } from 'firebase/auth';

interface LoggedInHomeProps {
  handleSubmit: () => void;
  user: User;
  chats: Record<string, any>;
  setChats: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const LoggedInHome = ({ handleSubmit, user, chats, setChats }: LoggedInHomeProps) => {
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const sendButtonref = useRef<HTMLButtonElement | null>(null);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [autoPlay, setAutoPlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatLanguage, setChatLanguage] = useState(null);
  const [chatTranslatedLang, setChatTranslatedLang] = useState(null);
  const [messages, setMessages] = useState([{ content: "", role: 'system' }]);
  const [currentlyPlayingMessageId, setCurrentlyPlayingMessageId] = useState(null);
  const [settingsExpanded, setSettingsExpanded] = useState(false);

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

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const keyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (handleSubmit) {
        handleSubmit();
      }
      if (sendButtonref.current) {
        sendButtonref.current.click();
      }
    }
  };

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
          <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
            {/* Render messages based on the current chat */}
            {currentChatId !== null && chats[currentChatId] && (
              chats[currentChatId].messages.map((message, index) => (
                <Message
                  key={message.id}
                  message={message}
                  canPlay={currentlyPlayingMessageId === null || currentlyPlayingMessageId === message.id}
                  onPlayStateChange={(messageId, isPlaying) => {
                    if (isPlaying) {
                      setCurrentlyPlayingMessageId(messageId);
                    } else if (currentlyPlayingMessageId === messageId) {
                      setCurrentlyPlayingMessageId(null);
                    }
                  }}
                  previousMessageDate={index > 0 ? chats[currentChatId].messages[index - 1].addedAt : null}
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
        autoPlay={autoPlay}
        setAutoPlay={setAutoPlay}
        isExpanded={settingsExpanded}
        onToggle={() => setSettingsExpanded(!settingsExpanded)}
      />
    </div>
  );
};

export default LoggedInHome;
