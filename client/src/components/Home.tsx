import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Box, Paper, Button } from '@mui/material';
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';
import TranslateIcon from '@mui/icons-material/Translate';
import MessageIcon from '@mui/icons-material/Message';
import Fade from '@mui/material/Fade';
import image from '../static/1.png';
import image2 from '../static/2.jpg';
import SignIn from './sign-in';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

// Convert makeStyles to styled components
const MainContainer = styled(Box)(({ theme }) => ({
  overflow: 'auto'
}));

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: "100%",
  height: "100%",
  background: '#42a5f5',
  position: 'relative',
  zIndex: 1,
  boxSizing: 'border-box',
}));

const Box2 = styled(Box)(({ theme }) => ({
  background: '#bbdefb',
  width: "100%",
  height: "100%",
  padding: '2vw 10vw 2vw 10vw',
  boxSizing: 'border-box',
}));

const Box3 = styled(Box)(({ theme }) => ({
  background: '#e3f2fd',
  width: "100%",
  height: "100%",
  padding: '25px',
  flexDirection: 'row',
  boxSizing: 'border-box',
}));

const PictureBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  textAlign: 'center',
  justifyContent: 'center',
  width: '100%',
  position: 'relative',
  zIndex: 3,
}));

const TextBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 3,
  padding: '2.5vw'
}));

const PaperBox = styled(Box)(({ theme }) => ({
  padding: '1vw',
}));

const RightPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'white',
  borderRadius: '100px 100px 100px 5px',
  width: '10vw',
  height: '5vw',
  boxShadow: '#bbdefb -25px 20px 10px',
  border: '3px solid black',
  margin: '35px 0',
  [theme.breakpoints.down('md')]: {
    width: '16vw',
    height: '9.5vw',
    boxShadow: '#bbdefb -10px 15px 5px',
  }
}));

const LeftPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'white',
  borderRadius: '100px 100px 5px 100px',
  width: '10vw',
  height: '5vw',
  boxShadow: '#bbdefb 25px 20px 10px',
  border: '3px solid black',
  margin: '35px 0',
  [theme.breakpoints.down('md')]: {
    width: '16vw',
    height: '9.5vw',
    boxShadow: '#bbdefb 10px 15px 5px',
  }
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: '25vw',
  height: 'auto',
  [theme.breakpoints.down('md')]: {
    width: '50vw',
  }
}));

const FlagImage = styled('img')(({ theme }) => ({
  position: 'absolute',
  opacity: '5%',
  zIndex: 2,
  width: '100%',
  height: '100%'
}));

const FeaturesBox = styled(Box)(({ theme }) => ({
  width: '100%',
  flexDirection: 'row',
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

const PaperFeature = styled(Paper)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  flexDirection: 'column',
  width: '15vw',
  height: '15vw',
  margin: '20px',
  boxShadow: '#cfd8dc 0px 0px 10px 5px',
  [theme.breakpoints.down('md')]: {
    width: '69vw',
    height: '69vw'
  }
}));

const ChatText = styled(Typography)(({ theme }) => ({
  fontSize: '1vw',
  [theme.breakpoints.down('md')]: {
    fontSize: '2vw',
  }
}));

const WelcomeText = styled(Typography)(({ theme }) => ({
  fontSize: '3.5vw',
  fontWeight: 'bold',
  fontFamily: 'Times New Roman, Times, serif',
  [theme.breakpoints.down('md')]: {
    fontSize: '5.5vw',
  }
}));

const IntroText = styled(Typography)(({ theme }) => ({
  fontSize: '1vw',
  padding: '2vw',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5vw',
  }
}));

const AboutText = styled(Typography)(({ theme }) => ({
  fontSize: '1.2vw',
  padding: '1vw',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5vw',
  }
}));

const FeaturesTitle = styled(Typography)(({ theme }) => ({
  fontSize: '3.5vw',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    fontSize: '5.5vw',
  }
}));

const FeaturesText = styled(Typography)(({ theme }) => ({
  fontSize: "1.2vw",
  [theme.breakpoints.down('md')]: {
    fontSize: "5vw",
  }
}));

const FeaturesDescription = styled(Typography)(({ theme }) => ({
  fontSize: "0.7vw",
  padding: '1vw',
  [theme.breakpoints.down('md')]: {
    fontSize: "3vw",
    padding: '5vw'
  }
}));

const StyledIcon = styled('div')(({ theme }) => ({
  '& > *': {
    fontSize: '2rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '3rem',
    }
  }
}));

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <MainContainer>
      <StyledBox>
        <FlagImage src={image2} alt="Background flag" />
        <PictureBox>
          <PaperBox>
            <Fade in={true} timeout={2000}>
              <LeftPaper variant="outlined">
                <ChatText variant="h5">你好。 你今天怎么样？</ChatText>
              </LeftPaper>
            </Fade>
            <Fade in={true} timeout={3000}>
              <LeftPaper variant="outlined">
                <ChatText variant="h5">مرحبًا. كيف حالك اليوم؟</ChatText>
              </LeftPaper>
            </Fade>
            <Fade in={true} timeout={4000}>
              <LeftPaper variant="outlined">
                <ChatText variant="h5">Привет. Как вы сегодня?</ChatText>
              </LeftPaper>
            </Fade>
          </PaperBox>

          <StyledImage src={image} alt="Main illustration" />

          <PaperBox>
            <Fade in={true} timeout={2000}>
              <RightPaper variant="outlined">
                <ChatText variant="h5">Hello. How are you today?</ChatText>
              </RightPaper>
            </Fade>
            <Fade in={true} timeout={3000}>
              <RightPaper variant="outlined">
                <ChatText variant="h5">Hej. Hur mår du idag?</ChatText>
              </RightPaper>
            </Fade>
            <Fade in={true} timeout={4000}>
              <RightPaper variant="outlined">
                <ChatText variant="h5">Hola. ¿Cómo estás hoy?</ChatText>
              </RightPaper>
            </Fade>
          </PaperBox>
        </PictureBox>

        <TextBox>
          <WelcomeText variant="h2">Welcome to PolyglotBot!</WelcomeText>
          <IntroText variant="h5">
            Introducing your state-of-the-art conversational
            and personalized AI chatbot, capable of understanding and communicating in more than 30 languages.
          </IntroText>
          <SignIn user={user} />
        </TextBox>
      </StyledBox>

      <Box2>
        <FeaturesTitle variant="h2">About</FeaturesTitle>
        <AboutText>
          PolyglotBot, powered by OpenAI, is designed to offer seamless interaction, adapting to your
          language preferences and conversation style. With a diverse linguistic capability, the chatbot
          can effortlessly switch between languages, making it ideal for multilingual individuals or
          those looking to practice a new language. It's not just about language translation; the AI
          comprehends cultural nuances and idioms, ensuring that conversations feel natural and relevant.
        </AboutText>
      </Box2>

      <Box3>
        <FeaturesTitle variant="h2">Features</FeaturesTitle>
        <FeaturesBox>
          <PaperFeature>
            <StyledIcon>
              <MessageIcon />
            </StyledIcon>
            <FeaturesText variant="h5">Instant Messaging</FeaturesText>
            <FeaturesDescription variant="h5">
              Chat instantly with the AI chatbot through text messaging. Experience seamless conversations
              in over 30 languages. Whether you're seeking information, guidance, or just a friendly
              conversation, PolyglotBot is here to assist, making every interaction effortlessly
              informative and enjoyable.
            </FeaturesDescription>
          </PaperFeature>
          <PaperFeature>
            <StyledIcon>
              <TranslateIcon />
            </StyledIcon>
            <FeaturesText variant="h5">Direct Translation</FeaturesText>
            <FeaturesDescription variant="h5">
              Break down language barriers with our real-time direct translation feature. Experience
              seamless communication across languages, ensuring accurate and natural conversations.
              Perfect for both personal and professional interactions, our direct translation bridges
              language gaps effortlessly.
            </FeaturesDescription>
          </PaperFeature>
          <PaperFeature>
            <StyledIcon>
              <SettingsVoiceIcon />
            </StyledIcon>
            <FeaturesText variant="h5">Voice Chat</FeaturesText>
            <FeaturesDescription variant="h5">
              Elevate your experience with our live voice chat feature. Talk directly with the AI in a
              natural and conversational manner in your chosen language, while also enjoying real-time
              text translations. This feature replicates the dynamics of a phone call making every
              conversation as real as talking to a native speaker.
            </FeaturesDescription>
          </PaperFeature>
        </FeaturesBox>
      </Box3>
    </MainContainer>
  );
}