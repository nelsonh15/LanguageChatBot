import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Grid } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Chats from "./Chats";
import Message from "./Message";
import { onAuthStateChangedHelper, getUserChatsandMessages, getMessages, getChosenChatLanguages, addChat, deleteChat, addMessages } from "../firebase";
import ChatStarter from "./ChatStarter";
import LanguageDialog from "./LanguageDialog";
import Settings from "./Settings";
import { getAIText, translatedText, handleTextToSpeech, chatCompletion } from "../state/api";

const LoggedInHome = ({ handleSubmit }) => {
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const sendButtonref = useRef<HTMLButtonElement | null>(null);
  const [user, setUser] = useState(null); // Add user state
  const [chats, setChats] = useState({});
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [autoPlay, setAutoPlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatLanguage, setChatLanguage] = useState(null);
  const [chatTranslatedLang, setChatTranslatedLang] = useState(null);
  const [messages, setMessages] = useState([{content: "", role: 'system'}]);
  const [currentlyPlayingMessageId, setCurrentlyPlayingMessageId] = useState(null);

  useEffect(() => {
    // Set up an observer for authentication state changes
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });
    // Clean up the observer when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
    // Fetch user data when the user state changes
      if (user) {
        const userChats = await getUserChatsandMessages(user);
        // Handle the userChats data as needed
        if (userChats) {
          setChats(userChats);
        }
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    async function loadMessages() {
      if (user && currentChatId) {
        const fetchedMessages = await getMessages(user, currentChatId);
        setMessages(fetchedMessages);
      }
    };
    loadMessages();
  }, [user, currentChatId]);

  useEffect(() => {
    const fetchLanguages = async () => {
      if (user && currentChatId) {
        const languages = await getChosenChatLanguages(user, currentChatId);
        if (languages) {
          setChatLanguage(languages[0]);
          setChatTranslatedLang(languages[1]);
        }
      }
    };
    fetchLanguages();
  }, [user, currentChatId]);

  useEffect(() => {
    if (currentChatId !== null && chats[currentChatId].messages.length) {
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

  const deleteChatHandler = async (chatId: number) => {
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
      addMessages(user, currentChatId, chats[currentChatId].messages.length+1, "user", input, translatedUserText)
      const newMessage = { 
        id: chats[currentChatId].messages.length + 1, 
        content: input, 
        role: "user", 
        translated: translatedUserText
      };

      const updatedChats = { ...chats };
      updatedChats[currentChatId].messages.push(newMessage);
      setChats(updatedChats);

      const message = {
        content: input,
        role: "user"
      }
      messages.push(message)

      setInput("");
      setLoading(true);

      //const aiText = await getAIText(input, chatLanguage);
      const aiText = await chatCompletion(messages, chatLanguage)
      const translatedAIText = await translatedText(aiText, chatLanguage, chatTranslatedLang)
      addMessages(user, currentChatId, chats[currentChatId].messages.length+1, "assistant", aiText, translatedAIText)
      const newAIMessage = { 
        id: chats[currentChatId].messages.length + 1, 
        content: aiText, 
        role: "assistant", 
        translated: translatedAIText
      };
      const updatedChats2 = { ...chats };
      updatedChats2[currentChatId].messages.push(newAIMessage);
      setChats(updatedChats2);

      const message2 = {
        content: aiText, 
        role: "assistant"
      }
      messages.push(message2)

      if (autoPlay) {
        handleTextToSpeech(aiText, setAudioUrl);
      }
      

      setLoading(false);
    }
  };

  const handleLanguageDialogSubmit = async (chatName, language, translatedLang) => {
    if (user) {
      const newChatId = await addChat(user, chatName, language, translatedLang);
  
      if (newChatId !== null) {
        const newChat = {
          id: newChatId,
          chat: chatName,
          messages: [],
        };
        // Add the new chat to the list of chats
        setChats({...chats, [newChatId]: newChat });
  
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

  return (
    <div style={{ display: "flex", flexDirection: "row", margin: 1, padding: 0 }}>
      <Box sx={{
        height: "91vh",
        width: "16%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey.300",
        border: '2px solid #4682B4',
        overflow: 'auto'
        }}>
          <LanguageDialog open={showLanguageDialog} onClose={() => setShowLanguageDialog(false)} onSubmit={handleLanguageDialogSubmit} />
          <Chats chats={chats} deleteChatHandler={deleteChatHandler} switchChat={switchChat} handleNewChatClick={handleNewChatClick} currentChatId={currentChatId}/>
      </Box>

      {currentChatId !== null ? (
        <Box sx={{
          height: "91vh",
          width: "69%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "grey.300",
          border: '2px solid #4682B4'
          }}>
          <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
            {/* Render messages based on the current chat */}
            {currentChatId !== null && chats[currentChatId] &&(
              chats[currentChatId].messages.map((message) => (
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
                />
              ))
            )}
            <div ref={chatBoxRef} />
          </Box>

          <Box sx={{ p: 2, backgroundColor: "background.default", borderTop: '2px solid #4682B4' }}>
            <Grid container spacing={2}>
              <Grid item xs={10}>
                <TextField size="small" fullWidth placeholder="Type a message" variant="outlined" value={input} onChange={handleInputChange} onKeyDown={keyPress} />
              </Grid>
              <Grid item xs={2}>
                <Button ref={sendButtonref} fullWidth color="primary" variant="contained" endIcon={<SendIcon />} onClick={handleSend} disabled={loading}>
                  Send
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
        ) : (
        <Box sx={{
          height: "91vh",
          width: "84%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "grey.300",
          border: '2px solid #4682B4'
          }}>
            <ChatStarter />
        </Box>
        )
      }
    <Settings autoPlay={autoPlay} setAutoPlay={setAutoPlay} />
    </div>
  );
};

export default LoggedInHome;
