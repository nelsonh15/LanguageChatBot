import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './components/Home';
import LoggedInHome from './components/LoggedInHome';
import { onAuthStateChangedHelper } from './firebase';
import { Box } from '@mui/material';
import './App.css'

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
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
    </div>
  );
}
