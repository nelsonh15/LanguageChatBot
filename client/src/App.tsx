import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import LoggedInHome from './components/ChatsPage/LoggedInHome';
import Review from './components/ReviewPage/Review';
import Shop from './components/ShopPage/Shop';
import Stats from './components/StatsPage/Stats';
import Profile from './components/ProfilePage/Profile';
import { onAuthStateChangedHelper, getUserChats, getUserChatsandMessages, getUserSettings } from './firebase';
import SessionExpired from './components/ChatsPage/SessionExpired'; // Ensure this is correctly imported
import { Box } from '@mui/material';
import './App.css';
import './styles/theme.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [chatsMessages, setChatsMessages] = useState({});
  const [userSettings, setUserSettings] = useState([]);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    }, setUserSettings);

    const handleSessionExpiredEvent = () => {
      setSessionExpiredOpen(true);
      // Optionally, automatically close the snackbar after a delay
      setTimeout(() => setSessionExpiredOpen(false), 5000); // Adjust time as needed
    };

    window.addEventListener('session-expired', handleSessionExpiredEvent);

    return () => {
      unsubscribe();
      window.removeEventListener('session-expired', handleSessionExpiredEvent);
    };
  }, []);

  useEffect(() => {
    const fetchUserChatsandMessages = async () => {
      if (user) {
        const userChatsandMessages = await getUserChatsandMessages(user);
        if (userChatsandMessages) {
          setChatsMessages(userChatsandMessages);
          // Convert chatsMessages object to array for Review component
          const chatsArray = Object.values(userChatsandMessages);
          setChats(chatsArray);
        }
      }
    };
    const fetchSettings = async () => {
      if (user) {
        const userSettings = await getUserSettings(user);
        if (userSettings) {
          setUserSettings(userSettings);
        }
      }
    }
    fetchUserChatsandMessages();
    fetchSettings();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUserSettings([]);
      setChats([]);
      setChatsMessages({});
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Box sx={{
        display: 'flex',
        width: '100%',
        overflow: 'hidden' // Prevent any potential scrolling issues
      }}>
        {user && <Sidebar />}
        <Box sx={{
          flexGrow: 1,
          overflow: 'auto' // Allow content to scroll if needed
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/loggedin"
              element={
                user ? (
                  <LoggedInHome
                    handleSubmit={undefined}
                    user={user}
                    chats={chatsMessages}
                    setChats={setChatsMessages}
                    settings={userSettings}
                    setUserSettings={setUserSettings}
                    setChatsArray={setChats}
                  />
                ) : (
                  <Home />
                )
              }
            />
            <Route path="/review" element={user ? <Review chats={chats} /> : <Home />} />
            <Route path="/stats" element={user ? <Stats /> : <Home />} />
            <Route path="/shop" element={user ? <Shop /> : <Home />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Home />} />
          </Routes>
        </Box>
      </Box>
      {/* Pass the state and setter as props to control the SessionExpired component */}
      <SessionExpired open={sessionExpiredOpen} setOpen={setSessionExpiredOpen} />
    </BrowserRouter>
  );
}
