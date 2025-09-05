import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Container,
  Fade,
  Chip,
  AppBar,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlipIcon from '@mui/icons-material/Flip';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const FlashcardContainer = styled(Box)(({ theme }) => ({
  perspective: '1000px',
  width: '100%',
  maxWidth: '500px',
  height: '400px',
  margin: '0 auto',
}));

const FlashcardInner = styled(Box)<{ flipped: boolean }>(({ theme, flipped }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  transition: 'transform 0.6s',
  transformStyle: 'preserve-3d',
  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
}));

const FlashcardSide = styled(Card)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '16px',
  boxShadow: theme.shadows[8],
}));

const FlashcardBack = styled(FlashcardSide)({
  transform: 'rotateY(180deg)',
});

interface Word {
  id: string;
  word: string;
  translation: string;
  sentence: string;
}

interface ReviewSession {
  id: string;
  chatName: string;
  targetLanguage: string;
  translationLanguage: string;
  targetFlag: string;
  translationFlag: string;
  reviewedWords: number;
  totalWords: number;
  words: Word[];
}

interface FlashcardReviewProps {
  session: ReviewSession;
  onBack: () => void;
}

function FlashcardReview({ session, onBack }: FlashcardReviewProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const currentWord = session.words[currentWordIndex];
  const progress = ((currentWordIndex + 1) / session.words.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = (correct: boolean) => {
    if (correct) {
      setReviewedCount(prev => prev + 1);
    }

    if (currentWordIndex < session.words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      // Review completed
      alert(`Review completed! You got ${reviewedCount} words correct.`);
      onBack();
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Set language based on the target language
      if (session.targetLanguage.toLowerCase().includes('spanish')) {
        utterance.lang = 'es-ES';
      } else if (session.targetLanguage.toLowerCase().includes('french')) {
        utterance.lang = 'fr-FR';
      } else if (session.targetLanguage.toLowerCase().includes('german')) {
        utterance.lang = 'de-DE';
      }
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={onBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {session.chatName}
          </Typography>
          <Chip
            label={`${currentWordIndex + 1} / ${session.words.length}`}
            color="primary"
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              }
            }}
          />
        </Box>

        <FlashcardContainer>
          <FlashcardInner flipped={isFlipped}>
            {/* Front Side */}
            <FlashcardSide>
              <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                textAlign: 'center'
              }}>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 2
                  }}
                >
                  {currentWord.word}
                </Typography>

                <IconButton
                  onClick={() => handleSpeak(currentWord.word)}
                  sx={{
                    bgcolor: 'primary.light',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.main',
                    }
                  }}
                >
                  <VolumeUpIcon />
                </IconButton>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 3, fontStyle: 'italic' }}
                >
                  "{currentWord.sentence}"
                </Typography>
              </CardContent>
            </FlashcardSide>

            {/* Back Side */}
            <FlashcardBack>
              <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                textAlign: 'center'
              }}>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    color: 'secondary.main',
                    mb: 2
                  }}
                >
                  {currentWord.translation}
                </Typography>

                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {currentWord.word}
                </Typography>

                <IconButton
                  onClick={() => handleSpeak(currentWord.translation)}
                  sx={{
                    bgcolor: 'secondary.light',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'secondary.main',
                    }
                  }}
                >
                  <VolumeUpIcon />
                </IconButton>
              </CardContent>
            </FlashcardBack>
          </FlashcardInner>
        </FlashcardContainer>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mt: 4,
          flexWrap: 'wrap'
        }}>
          {!isFlipped ? (
            <Button
              variant="contained"
              onClick={handleFlip}
              startIcon={<FlipIcon />}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                px: 4,
                py: 1.5
              }}
            >
              Show Translation
            </Button>
          ) : (
            <Fade in={isFlipped}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleNext(false)}
                  startIcon={<CloseIcon />}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    px: 3,
                    py: 1.5
                  }}
                >
                  Incorrect
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleNext(true)}
                  startIcon={<CheckIcon />}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    px: 3,
                    py: 1.5
                  }}
                >
                  Correct
                </Button>
              </Box>
            </Fade>
          )}
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Correct answers: {reviewedCount} / {currentWordIndex + (isFlipped ? 1 : 0)}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default FlashcardReview;