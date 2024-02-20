import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Paper, Button } from '@material-ui/core';
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';
import TranslateIcon from '@mui/icons-material/Translate';
import MessageIcon from '@mui/icons-material/Message';
import Fade from '@mui/material/Fade'
import image from '../static/1.png';
import image2 from '../static/2.jpg';

const useStyles = makeStyles((theme) => ({
    mainContainer: {
      overflow: 'auto'
    },
    box: {
      display: 'flex', 
      justifyContent: 'center',
      width: "100%",
      height: "100%",
      background: '#42a5f5',
      position: 'relative',
      zIndex: 1,
      boxSizing: 'border-box',
    },
    box2: { 
      background: '#bbdefb',
      width: "100%",
      height: "100%",
      padding: '2vw 10vw 2vw 10vw',
      boxSizing: 'border-box',
    },
    box3: {
      background: '#e3f2fd',
      width: "100%",
      height: "100%",
      padding: '25px',
      flexDirection: 'row',
      boxSizing: 'border-box',
    },
    pictureBox: {
      display: 'flex',
      textAlign: 'center',
      justifyContent: 'center',
      width: '100%',
      position: 'relative',
      zIndex: 3,
    },
    textBox: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 3,
      padding: '2.5vw'
    },
    paperBox: {
      // Adjust padding to be more dynamic
      padding: '1vw',
    },
    chatText: {
      fontSize: '1vw'
    },
    welcomeText: {
      fontSize: '3.5vw',
      fontWeight: 'bold',
      fontFamily: 'Times New Roman, Times, serif'
    },
    introText: {
      fontSize: '1vw',
      padding: '2vw'
    },
    rightPaper: {
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
    },
    leftPaper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
      borderRadius: '100px 100px 5px 100px ',
      width: '10vw',
      height: '5vw',
      boxShadow: '#bbdefb 25px 20px 10px',
      border: '3px solid black',
      margin: '35px 0'
    },
    image: {
      width: '25vw', // Base width for the image
      height: 'auto', // Adjust height automatically to maintain aspect ratio
    },
    button: {
      fontSize: '0.8vw',
      maxidth: '7vw'
    },
    flag: {
      position: 'absolute',
      opacity: '5%',
      zIndex: 2,
    },
    featuresBox: {
      width: '100%',
      flexDirection: 'row',
      display: 'flex',
      justifyContent: 'center'
    },
    paperFeature: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      flexDirection: 'column',
      width: '15vw',
      height: '15vw', 
      margin: '20px',
      boxShadow: '#cfd8dc 0px 0px 10px 5px'
    },
    about: {
      fontSize: '3.5vw',
    },
    aboutText: {
      fontSize: '1.2vw', //it's the VIEWPORT
      padding: '1vw'
    },
    icons: {
      fontSize: '13'
    },
    features: {
      fontSize: '3.5vw',
    },
    featuresText: {
      fontSize: "1.2vw",
    },
    featuresDescription: {
      fontSize: "0.7vw", 
      padding: '1vw'
    },
    '@media (max-width: 768px)': {
      // Adjustments for mobile view
      box: {
        flexDirection: 'column',
      },
      box2: {
        padding: '2vw 10vw 2vw 10vw',
      },
      box3: {
      },
      leftPaper: {
        width: '16vw',
        height: '9.5vw',
        boxShadow: '#bbdefb 10px 15px 5px',
      },
      rightPaper: {
        width: '16vw',
        height: '9.5vw',
        boxShadow: '#bbdefb -10px 15px 5px',
      },
      chatText: {
        fontSize: '2vw',
      },
      welcomeText: {
      fontSize: '5.5vw',
      fontWeight: 'bold',
      fontFamily: 'Times New Roman, Times, serif'
      },
      introText: {
        fontSize: '2.5vw',
        padding: '2vw'
      },
      image: {
        width: '50vw', 
        height: 'auto',
      },
      button: {
        fontSize: '2vw',
      },
      about: {
        fontSize: '5.5vw',
      },
      aboutText: {
        fontSize: '2.5vw',
      },
      icons: {
        fontSize: '3'
      },
      featuresBox: {
        flexDirection: 'column',
        alignItems: 'center', 
      },
      paperFeature: {
        width: '69vw',
        height: '69vw'
      },
      features: {
        fontSize: '5.5vw',
      },
      featuresText: {
        fontSize: "5vw",
      },
      featuresDescription: {
        fontSize: "3vw", 
        padding: '5vw'
      },
    },
}));

export default function Home() {
    const classes = useStyles();
    return (
      <Box className={classes.mainContainer}>
        <Box className={classes.box}>
          <img className={classes.flag} src={image2} width="100%" height="100%"/>
          <Box className ={classes.pictureBox}>
            <Box className={classes.paperBox}>
              <Fade in={true} timeout={2000}>
                <Paper className={classes.leftPaper} variant="outlined">
                  <Typography className={classes.chatText} variant="h5"> 你好。 你今天怎么样？ </Typography>
                </Paper>
              </Fade>
              <Fade in={true} timeout={3000}>
                <Paper className={classes.leftPaper} variant="outlined">
                  <Typography className={classes.chatText} variant="h5"> مرحبًا. كيف حالك اليوم؟ </Typography>
                </Paper>
              </Fade>
              <Fade in={true} timeout={4000}>
                <Paper className={classes.leftPaper} variant="outlined">
                  <Typography className={classes.chatText} variant="h5"> Привет. Как вы сегодня? </Typography>
                </Paper>
              </Fade>
            </Box>
            
            <img src={image} className={classes.image} width="650" height="630"/>
            
            <Box className={classes.paperBox}>
              <Fade in={true} timeout={2000}>
                <Paper className={classes.rightPaper} variant="outlined">
                  <Typography className={classes.chatText} variant="h5"> Hello. How are you today?</Typography>
                </Paper>
              </Fade>
              <Fade in={true} timeout={3000}>
                <Paper className={classes.rightPaper} variant="outlined">
                  <Typography className={classes.chatText} variant="h5"> Hej. Hur mår du idag? </Typography>
                </Paper>
              </Fade>
              <Fade in={true} timeout={4000}>
                <Paper className={classes.rightPaper} variant="outlined">
                  <Typography className={classes.chatText} variant="h5"> Hola. ¿Cómo estás hoy? </Typography>
                </Paper>
              </Fade>
            </Box>
          </Box>
          
          <Box className={classes.textBox}>
            <Typography className={classes.welcomeText} variant="h2"> Welcome to PolyglotBot!</Typography>
            <Typography className={classes.introText} variant="h5"> Introducing your state-of-the-art conversational 
              and personalized AI chatbot, capable of understanding and communicating in more than 30 languages.
            </Typography> 
            <Button className={classes.button} variant="outlined"> Learn More </Button>
          </Box>
        </Box>

        <Box className={classes.box2}>
          <Typography className={classes.about} style={{textAlign:'center'}} variant="h2">
            About
          </Typography>
          <Typography className={classes.aboutText}>
            PolyglotBot, powered by OpenAI, is designed to offer seamless interaction, adapting to your 
            language preferences and conversation style. With a diverse linguistic capability, the chatbot
            can effortlessly switch between languages, making it ideal for multilingual individuals or 
            those looking to practice a new language. It's not just about language translation; the AI 
            comprehends cultural nuances and idioms, ensuring that conversations feel natural and relevant. 
          </Typography>
        </Box>

        <Box className={classes.box3}>
          <Typography className={classes.features} style={{textAlign:'center'}} variant="h2">
            Features
          </Typography>
          <Box className={classes.featuresBox}>
            <Paper className={classes.paperFeature}>
              <MessageIcon className={classes.icons} />
              <Typography className={classes.featuresText} variant="h5">
                Instant Messaging
              </Typography>
              <Typography className={classes.featuresDescription} variant="h5">
                Chat instantly with the AI chatbot through text messaging. Experience seamless conversations 
                in over 30 languages. Whether you're seeking information, guidance, or just a friendly 
                conversation, PolyglotBot is here to assist, making every interaction effortlessly 
                informative and enjoyable.
              </Typography>
            </Paper>
            <Paper className={classes.paperFeature}>
              <TranslateIcon className={classes.icons}/>
              <Typography className={classes.featuresText} variant="h5">
                Direct Translation
              </Typography>
              <Typography className={classes.featuresDescription} variant="h5">
                Break down language barriers with our real-time direct translation feature. Experience 
                seamless communication across languages, ensuring accurate and natural conversations. 
                Perfect for both personal and professional interactions, our direct translation bridges 
                language gaps effortlessly.
              </Typography>
            </Paper>
            <Paper className={classes.paperFeature}>
              <SettingsVoiceIcon className={classes.icons}/>
              <Typography className={classes.featuresText} variant="h5">
                Voice Chat
              </Typography>
              <Typography className={classes.featuresDescription} variant="h5">
                Elevate your experience with our live voice chat feature. Talk directly with the AI in a 
                natural and conversational manner in your chosen language, while also enjoying real-time 
                text translations. This feature replicates the dynamics of a phone call making every 
                conversation as real as talking to a native speaker. 
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    );
}