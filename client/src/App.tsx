import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import LoggedInHome from './components/LoggedInHome';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import { onAuthStateChangedHelper, getUserChatsandMessages } from './firebase';
import SessionExpired from './components/SessionExpired'; // Ensure this is correctly imported
import { Box } from '@mui/material';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);
  const [chats, setChats] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });

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
    const fetchData = async () => {
      if (user) {
        const userChats = await getUserChatsandMessages(user);
        if (userChats) {
          setChats(userChats);
        }
      }
    };
    fetchData();
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
                    chats={chats}
                    setChats={setChats}
                  />
                ) : (
                  <Home />
                )
              }
            />
            <Route path="/analytics" element={user ? <Analytics /> : <Home />} />
            <Route path="/profile" element={user ? <Profile /> : <Home />} />
          </Routes>
        </Box>
      </Box>
      {/* Pass the state and setter as props to control the SessionExpired component */}
      <SessionExpired open={sessionExpiredOpen} setOpen={setSessionExpiredOpen} />
    </BrowserRouter>
  );
}
