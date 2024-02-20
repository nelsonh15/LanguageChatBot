import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import LoggedInHome from './components/LoggedInHome';
import { onAuthStateChangedHelper } from './firebase';
import SessionExpired from './components/SessionExpired'; // Ensure this is correctly imported
import { Box } from '@mui/material';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);

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

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Box width="100%" height="100%" padding="4rem 0rem 0rem 0rem">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loggedin" element={user ? <LoggedInHome handleSubmit={undefined} /> : <Home />} />
          </Routes>
        </Box>
      </BrowserRouter>
      {/* Pass the state and setter as props to control the SessionExpired component */}
      <SessionExpired open={sessionExpiredOpen} setOpen={setSessionExpiredOpen} />
    </div>
  );
}
