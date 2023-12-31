import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import SignIn from './sign-in';
import { useEffect, useState } from 'react';
import { onAuthStateChangedHelper } from '../firebase';
import { User } from 'firebase/auth';
import styles from './styles/navbar.module.css';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  });

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <AppBar className={styles.navbar}>
        <Toolbar>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "auto" }}>
            <SignIn user={user} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
