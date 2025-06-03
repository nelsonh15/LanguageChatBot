'use client';

import { Fragment } from 'react';
import { signInWithGoogle, signOut } from '../firebase';
import { User } from 'firebase/auth';
import { Box, Button } from "@mui/material";
import React from 'react';
import styles from './styles/sign-in.module.css';
import { useNavigate } from 'react-router-dom';

interface SignInProps {
  user: User | null;
}

export default function SignIn({ user }: SignInProps) {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      // Use await if signInWithGoogle returns a promise
      await signInWithGoogle();
      // After a successful login, navigate to the LoggedInHome page
      navigate('/loggedin');
    } catch (error) {
      // Handle any errors here
    }
  }
  return (
    <Fragment>
      {user ? (
        <Button className={styles.signin} variant="contained" onClick={signOut} >
          Logout
        </Button>
      ) : (
        <Button className={styles.signin} onClick={handleSignIn} variant="contained">
          Login
        </Button>
      )}
    </Fragment>
  );
}
