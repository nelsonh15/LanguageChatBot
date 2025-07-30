import React, { useEffect, useState, useRef } from 'react';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Typography,
  Box,
  Paper,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Rating,
  Chip,
  Fade,
  Avatar,
  IconButton,
  Stack,
  Divider,
  AppBar,
  Toolbar,
  keyframes
} from '@mui/material';
import {
  MessageOutlined as MessageIcon,
  TranslateOutlined as TranslateIcon,
  CallOutlined as VoiceIcon,
  PlayArrowOutlined as PlayIcon,
  VideoLibraryOutlined as VideoIcon,
  Brightness4Outlined as DarkModeIcon,
  Brightness7Outlined as LightModeIcon,
  TrendingUpOutlined as AnalyticsIcon,
  AutoAwesomeOutlined as MagicIcon,
  SecurityOutlined as SafeIcon,
  AccessTimeOutlined as TimeIcon,
  PublicOutlined as GlobalIcon,
  EmojiEventsOutlined as TrophyIcon,
  SmartToyOutlined as RobotIcon
} from '@mui/icons-material';
import { onAuthStateChangedHelper } from '../firebase';
import { User } from 'firebase/auth';
import SignIn from './sign-in';
import image from '../static/1.png';

// Create theme function
const createAppTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: '#0078D7',
      light: '#40A2E3',
      dark: '#005A9F',
    },
    secondary: {
      main: '#43A047',
      light: '#66BB6A',
      dark: '#2E7D32',
    },
    warning: {
      main: '#F9A825',
    },
    background: {
      default: darkMode ? '#121212' : '#FAFBFC',
      paper: darkMode ? '#1E1E1E' : '#FFFFFF',
    },
    text: {
      primary: darkMode ? '#FFFFFF' : '#1A1A1A',
      secondary: darkMode ? '#B3B3B3' : '#6B7280',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Montserrat", "Roboto", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Montserrat", "Roboto", sans-serif',
      fontWeight: 700,
    },
  }
});

// Squarespace-style rotating animation keyframes
const slideInFromTop = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideOutToBottom = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(30px);
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const chatBubblePulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
`;

// Add slide-in animation keyframes
const slideInFromLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromBottom = keyframes`
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Color constants for dynamic theming
const getColors = (darkMode) => ({
  primary: '#0078D7',
  accent: '#43A047',
  warning: '#F9A825',
  background: darkMode ? '#242525' : '#f5f9ff',
  surface: darkMode ? '#1E1E1E' : '#FFFFFF',
  text: darkMode ? '#FFFFFF' : '#1A1A1A',
  textSecondary: darkMode ? '#B3B3B3' : '#6B7280',
  gradient: 'linear-gradient(135deg, #0078D7 0%, #43A047 100%)',
  shadow: darkMode ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 120, 215, 0.15)'
});

// Top Navigation Bar
const TopNavigation = styled(AppBar)<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  background: darkMode
    ? 'rgba(30, 30, 30, 0.95)'
    : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  boxShadow: darkMode
    ? '0 2px 10px rgba(0, 0, 0, 0.3)'
    : '0 2px 10px rgba(0, 0, 0, 0.05)',
}));

// Dynamic Styled Components
const HeroSection = styled(Box)<{ darkMode: boolean }>(({ theme, darkMode }) => {
  const colors = getColors(darkMode);
  return {
    background: darkMode
      ? `
        radial-gradient(circle at 20% 80%, rgba(0, 120, 215, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(67, 160, 71, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, #121212 0%, #1E1E1E 100%)
      `
      : `
        radial-gradient(circle at 20% 80%, rgba(0, 120, 215, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(67, 160, 71, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #FAFBFC 0%, #F0F8FF 100%)
      `,
    //minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    // paddingTop: '80px',
  };
});

// Chat Bubble Component with Rotating Text
const ChatBubble = styled(Box)<{ darkMode: boolean }>(({ theme, darkMode }) => {
  const colors = getColors(darkMode);
  return {
    position: 'relative',
    background: colors.surface,
    borderRadius: '20px 20px 20px 20px',
    padding: '20px 32px',
    maxWidth: '1000px',
    boxShadow: colors.shadow,
    border: `2px solid ${colors.primary}70`,
    animation: `${chatBubblePulse} 6s ease-in-out infinite`,
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: 20,
      left: -17,
      width: 0,
      height: 0,
      borderRight: `15px solid ${colors.primary}70`,
      borderBottom: '10px solid transparent',
      borderTop: '10px solid transparent',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 20,
      left: -15,
      width: 1,
      height: 0,
      borderRight: `15px solid ${colors.surface}`,
      borderBottom: '10px solid transparent',
      borderTop: '10px solid transparent',
    }
  };
});

// Rotating Text Container
const RotatingTextContainer = styled(Box)(() => ({
  position: 'relative',
  minHeight: '100px',
  minWidth: '170px',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
}));

// Individual Rotating Text Item
const RotatingTextItem = styled(Box)<{ isActive: boolean; isExiting: boolean; animationType: string; }>(({ isActive, isExiting, animationType }) => ({
  position: 'absolute',
  width: '100%',
  opacity: isActive ? 1 : 0,
  animation: isActive
    ? (animationType === 'slide' ? `${slideInFromTop} 0.6s ease-out` : `${fadeIn} 0.6s ease-out`)
    : isExiting
      ? (animationType === 'slide' ? `${slideOutToBottom} 0.6s ease-in` : `${fadeOut} 0.6s ease-in`)
      : 'none',
  transform: isActive ? 'translateY(0)' : 'translateY(-30px)',
}));

// Rotating Words Component
const RotatingWords = ({ languages, currentIndex, darkMode, animationType = 'slide' }) => {
  const [isExiting, setIsExiting] = useState(false);
  const colors = getColors(darkMode);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleAnimationEnd = () => {
    setIsExiting(false);
  };

  return (
    <RotatingTextContainer>
      {languages.map((language, index) => (
        <RotatingTextItem
          key={index}
          isActive={index === currentIndex}
          isExiting={isExiting}
          animationType={animationType}
          onAnimationEnd={handleAnimationEnd}
        >
          <Box textAlign="center">
            <Typography
              variant="h6"
              sx={{
                color: colors.text,
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: '1rem', md: '1.2rem' }
              }}
            >
              {language.flag} {language.text}
            </Typography>

          </Box>
        </RotatingTextItem>
      ))}
    </RotatingTextContainer>
  );
};

// Enhanced Demo Section
const DemoSection = styled(Box)<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '40px',
  flexWrap: 'wrap',
  margin: '100px 0 0 0',
  [theme.breakpoints.down('md')]: {
    gap: '20px',
    flexDirection: 'column'
  }
}));

const FeatureCard = styled(Card)<{ darkMode: boolean }>(({ theme, darkMode }) => {
  const colors = getColors(darkMode);
  return {
    height: '100%',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    border: '2px solid transparent',
    background: darkMode
      ? 'linear-gradient(145deg, #1E1E1E 0%, #2A2A2A 100%)'
      : 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: colors.shadow,
      borderColor: colors.primary,
    },
  };
});

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #0078D7 0%, #43A047 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: '2rem',
    color: 'white',
  },
}));

const TestimonialCard = styled(Card)<{ darkMode: boolean }>(({ theme, darkMode }) => {
  const colors = getColors(darkMode);
  return {
    height: '100%',
    background: darkMode
      ? 'linear-gradient(145deg, #1E1E1E 0%, #2A2A2A 100%)'
      : 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
    border: `1px solid ${darkMode ? 'rgba(0, 120, 215, 0.3)' : 'rgba(0, 120, 215, 0.2)'}`,
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: colors.shadow,
    }
  };
});

const CTASection = styled(Box)<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  background: 'linear-gradient(135deg, #0078D7 0%, #43A047 100%)',
  color: 'white',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
}));

const Footer = styled(Box)<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  background: darkMode ? '#0A0A0A' : '#1A1A1A',
  color: 'white',
  padding: theme.spacing(6, 0, 4),
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0078D7 0%, #43A047 100%)',
  color: 'white',
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 600,
  boxShadow: '0 4px 20px rgba(0, 120, 215, 0.15)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 25px rgba(0, 120, 215, 0.3)',
  },
}));

// Animated Section Component
const AnimatedSection = styled(Box)<{
  darkMode: boolean;
  isVisible: boolean;
  animationDirection: 'left' | 'right' | 'bottom' | 'top';
  delay?: number;
}>(({ theme, darkMode, isVisible, animationDirection, delay = 0 }) => {
  const getAnimation = () => {
    switch (animationDirection) {
      case 'left':
        return slideInFromLeft;
      case 'right':
        return slideInFromRight;
      case 'bottom':
        return slideInFromBottom;
      case 'top':
        return slideInFromTop;
      default:
        return slideInFromBottom;
    }
  };

  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate(0, 0)' :
      animationDirection === 'left' ? 'translateX(-50px)' :
        animationDirection === 'right' ? 'translateX(50px)' :
          animationDirection === 'top' ? 'translateY(-30px)' : 'translateY(50px)',
    animation: isVisible ? `${getAnimation()} 0.8s ease-out ${delay}s forwards` : 'none',
    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
  };
});

// Animated Card Component
const AnimatedCard = styled(Card)<{
  darkMode: boolean;
  isVisible: boolean;
  delay?: number;
}>(({ theme, darkMode, isVisible, delay = 0 }) => {
  const colors = getColors(darkMode);
  return {
    height: '100%',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    border: '2px solid transparent',
    borderRadius: '20px 20px 20px 20px',
    width: '100%',
    background: darkMode
      ? 'linear-gradient(145deg, #1E1E1E 0%, #2A2A2A 100%)'
      : 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    animation: isVisible ? `${slideInFromBottom} 0.8s ease-out ${delay}s forwards` : 'none',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: colors.shadow,
      borderColor: colors.primary,
    },
  };
});

function Home() {
  const [currentLanguage, setCurrentLanguage] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [animationType, setAnimationType] = useState('slide'); // 'slide' or 'fade'
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  // Create theme based on darkMode state
  const theme = createAppTheme(darkMode);
  const colors = getColors(darkMode);

  // Refs for each section
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const advantagesRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const languages = [
    { text: "Hello! Ready to practice naturally?", lang: "English", flag: "🇺🇸" },
    { text: "¡Hola! ¿Listo para practicar naturalmente?", lang: "Spanish", flag: "🇪🇸" },
    { text: "Bonjour! Prêt à pratiquer naturellement?", lang: "French", flag: "🇫🇷" },
    { text: "你好！准备好自然地练习了吗？", lang: "Chinese", flag: "🇨🇳" },
    { text: "안녕하세요! 자연스럽게 연습할 준비가 되셨나요?", lang: "Korean", flag: "🇰🇷" },
    { text: "Ciao! Pronto a praticare naturalmente?", lang: "Italian", flag: "🇮🇹" }
  ];

  const mainFeatures = [
    {
      icon: <MessageIcon />,
      title: "Instant Messaging",
      description: "Chat naturally with AI in real-time. Experience convenient, judgment-free conversations that feel completely natural and adapt to your pace."
    },
    {
      icon: <TranslateIcon />,
      title: "Direct Translation",
      description: "Get instant translations of AI responses in your preferred language. Learn faster with contextual understanding and cultural insights."
    },
    {
      icon: <VoiceIcon />,
      title: "Live Voice Calls",
      description: "Practice speaking naturally through live voice conversations. Build confidence in real-time speaking with immediate pronunciation feedback."
    },
    {
      icon: <AnalyticsIcon />,
      title: "Analytics",
      description: "Track your language learning journey with detailed dashboard analytics and personalized insights."
    },
  ];

  const testimonials = [
    {
      name: "Emma Rodriguez",
      role: "Marketing Professional",
      company: "Tech Startup",
      content: "PolyglotBot transformed my Spanish learning! The natural conversations make it feel like chatting with a friend. I gained confidence I never thought possible.",
      rating: 5,
      avatar: "ER",
      badge: "6 months user",
      improvement: "80% fluency increase"
    },
    {
      name: "James Chen",
      role: "University Student",
      company: "Stanford University",
      content: "The live voice calls are incredible. I can practice Mandarin pronunciation anytime, and the immediate feedback helped me sound natural faster.",
      rating: 5,
      avatar: "JC",
      badge: "Daily user",
      improvement: "Pronunciation perfected"
    },
    {
      name: "Sophie Laurent",
      role: "Travel Blogger",
      company: "Digital Nomad",
      content: "As someone constantly traveling, having a judgment-free AI partner to practice Korean has been life-changing. It's convenient and incredibly effective.",
      rating: 5,
      avatar: "SL",
      badge: "3 languages learned",
      improvement: "Fluent in 8 months"
    }
  ];

  const stats = [
    { number: "30+", label: "Languages Supported" },
    { number: "85K+", label: "Active Learners" },
    { number: "500K+", label: "Conversations Daily" },
    { number: "97%", label: "User Satisfaction" }
  ];

  const advantages = [
    { icon: <SafeIcon />, title: "Judgment-Free Environment", desc: "Practice speaking without fear of embarrassment" },
    { icon: <TimeIcon />, title: "Available 24/7", desc: "Speak whenever it's convenient for you" },
    { icon: <MagicIcon />, title: "AI-Powered Intelligence", desc: "Personalized learning that adapts to you" },
    { icon: <TrophyIcon />, title: "Fast Results", desc: "See improvement speaking a language in weeks, not years" }
  ];

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLanguage((prev) => (prev + 1) % languages.length);
    }, 4000); // Slightly longer to allow animation to complete
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleAnimationType = () => {
    setAnimationType(prev => prev === 'slide' ? 'fade' : 'slide');
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = [statsRef, featuresRef, advantagesRef, testimonialsRef, ctaRef];
    sections.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ background: colors.background, minHeight: '100vh' }}>
        {/* Top Navigation with Dark Mode Toggle */}
        <TopNavigation position="fixed" elevation={0} darkMode={darkMode}>
          <Toolbar>
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0078D7 0%, #43A047 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: '"Montserrat", sans-serif'
              }}
            >
              PolyglotBot
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton
                onClick={toggleDarkMode}
                sx={{
                  color: colors.text,
                  background: darkMode
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                  '&:hover': {
                    background: darkMode
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(0, 0, 0, 0.1)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              <SignIn user={user} />

            </Stack>
          </Toolbar>
        </TopNavigation>

        {/* Hero Section */}
        <HeroSection darkMode={darkMode}>
          <Container maxWidth="xl">
            <Box sx={{
              textAlign: 'center', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', [theme.breakpoints.down('lg')]: {
                gap: '20px',
                flexDirection: 'column'
              }
            }}>
              {/* Enhanced Robot and Chat Bubble Demo */}
              <Fade in timeout={1500}>
                <DemoSection darkMode={darkMode}>
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <img src={image} className={image} width="500" height="500" />
                    <Box>
                      <ChatBubble darkMode={darkMode}>
                        <RotatingWords
                          languages={languages}
                          currentIndex={currentLanguage}
                          darkMode={darkMode}
                          animationType={animationType}
                        />

                      </ChatBubble>
                    </Box>
                  </Box>
                </DemoSection>
              </Fade>
              <Box sx={{ width: '100%', ml: 5 }}>
                <Fade in timeout={1000}>
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: '2rem', md: '3rem' },
                        fontWeight: 'bold',
                        mb: 10,
                        lineHeight: 1.2,
                        color: colors.text
                      }}
                    >
                      Welcome to PolyglotBot!<br />
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        mb: 4,
                        color: colors.textSecondary,
                        maxWidth: '700px',
                        margin: '0 auto 2rem auto',
                        lineHeight: 1.6
                      }}
                    >
                      Introducing your state-of-the-art conversational and personalized AI chatbot, capable of understanding and communicating in more than 30 languages.
                    </Typography>
                  </Box>
                </Fade>

                {/* CTA Buttons */}
                <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap" mb={6}>
                  <GradientButton
                    size="large"
                    startIcon={<PlayIcon />}
                  >
                    Learn more
                  </GradientButton>

                </Box>
              </Box>

            </Box>
          </Container>
        </HeroSection>

        {/* Stats Section with Animation */}
        <AnimatedSection
          ref={statsRef}
          id="stats-section"
          darkMode={darkMode}
          isVisible={visibleSections.has('stats-section')}
          animationDirection="bottom"
          py={8}
          sx={{ background: colors.shadow }}
        >
          <Container maxWidth="lg">
            <Box textAlign="center">
              {/* Stats */}
              <Grid container spacing={10} justifyContent="center">
                {stats.map((stat, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <AnimatedSection
                      darkMode={darkMode}
                      isVisible={visibleSections.has('stats-section')}
                      animationDirection="bottom"
                      delay={index * 0.1}
                    >
                      <Box textAlign="center">
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: colors.primary }}>
                          {stat.number}
                        </Typography>
                        <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </AnimatedSection>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>
        </AnimatedSection>

        {/* Main Features Section with Animation */}
        <AnimatedSection
          ref={featuresRef}
          id="features-section"
          darkMode={darkMode}
          isVisible={visibleSections.has('features-section')}
          animationDirection="left"
          py={10}
          sx={{ background: colors.surface }}
        >
          <Container maxWidth="lg">
            <AnimatedSection
              darkMode={darkMode}
              isVisible={visibleSections.has('features-section')}
              animationDirection="top"
              textAlign="center"
              mb={8}
            >
              <Typography
                variant="h2"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: colors.text
                }}
              >
                Your Gateway to{' '}
                <Typography
                  component="span"
                  variant="h2"
                  sx={{
                    color: colors.primary,
                    fontWeight: 'bold',
                  }}
                >
                  Natural Conversations
                </Typography>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: colors.textSecondary,
                  maxWidth: '600px',
                  margin: '0 auto',
                }}
              >
                Experience convenient, natural language practice with these powerful features
              </Typography>
            </AnimatedSection>

            <Grid container spacing={4} mb={6}>
              {mainFeatures.map((feature, index) => (
                <Grid item xs={12} md={3} key={index}>
                  <AnimatedCard
                    elevation={8}
                    darkMode={darkMode}
                    isVisible={visibleSections.has('features-section')}
                    delay={index * 0.2}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                      <IconWrapper>
                        {feature.icon}
                      </IconWrapper>
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: colors.text
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.6,
                          color: colors.textSecondary
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </AnimatedCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </AnimatedSection>

        {/* Why Choose Us Section with Animation */}
        <AnimatedSection
          ref={advantagesRef}
          id="advantages-section"
          darkMode={darkMode}
          isVisible={visibleSections.has('advantages-section')}
          animationDirection="right"
          py={12}
          sx={{ background: colors.background }}
        >
          <Container maxWidth="lg">
            <AnimatedSection
              darkMode={darkMode}
              isVisible={visibleSections.has('advantages-section')}
              animationDirection="top"
              textAlign="center"
              mb={8}
            >
              <Typography
                variant="h2"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: colors.text
                }}
              >
                Why Choose PolyglotBot
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: colors.textSecondary }}
              >
                Experience convenient, natural language practice
              </Typography>
            </AnimatedSection>

            <Grid container spacing={6}>
              {advantages.map((advantage, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <AnimatedSection
                    darkMode={darkMode}
                    isVisible={visibleSections.has('advantages-section')}
                    animationDirection="bottom"
                    delay={index * 0.15}
                    textAlign="center"
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `${colors.primary}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0078D7 0%, #43A047 100%)',
                          transform: 'scale(1.1)',
                          '& svg': {
                            color: 'white'
                          }
                        }
                      }}
                    >
                      {React.cloneElement(advantage.icon, {
                        sx: { fontSize: '2rem', color: colors.primary, transition: 'color 0.3s ease' }
                      })}
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        color: colors.text
                      }}
                    >
                      {advantage.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: colors.textSecondary }}
                    >
                      {advantage.desc}
                    </Typography>
                  </AnimatedSection>
                </Grid>
              ))}
            </Grid>
          </Container>
        </AnimatedSection>

        {/* Testimonials Section with Animation */}
        <AnimatedSection
          ref={testimonialsRef}
          id="testimonials-section"
          darkMode={darkMode}
          isVisible={visibleSections.has('testimonials-section')}
          animationDirection="left"
          py={10}
          sx={{ background: colors.surface }}
        >
          <Container maxWidth="lg">
            <AnimatedSection
              darkMode={darkMode}
              isVisible={visibleSections.has('testimonials-section')}
              animationDirection="top"
              textAlign="center"
              mb={8}
            >
              <Typography
                variant="h2"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: colors.text
                }}
              >
                What Our Learners Say
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: colors.textSecondary }}
              >
                Join thousands discovering the convenience of natural AI conversations
              </Typography>
            </AnimatedSection>

            <Grid container spacing={3}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <AnimatedCard
                    elevation={1}
                    darkMode={darkMode}
                    isVisible={visibleSections.has('testimonials-section')}
                    delay={index * 0.2}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
                        <Rating
                          value={testimonial.rating}
                          readOnly
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: colors.warning
                            }
                          }}
                        />
                        <Chip
                          label={testimonial.badge}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #0078D7 0%, #43A047 100%)',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          mb: 3,
                          fontStyle: 'italic',
                          lineHeight: 1.7,
                          color: colors.text,
                        }}
                      >
                        "{testimonial.content}"
                      </Typography>

                      <Box
                        sx={{
                          background: `${colors.accent}20`,
                          borderRadius: 2,
                          p: 2,
                          mb: 3,
                          textAlign: 'center'
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.accent,
                            fontWeight: 600
                          }}
                        >
                          🎉 {testimonial.improvement}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            background: 'linear-gradient(135deg, #0078D7 0%, #43A047 100%)',
                            fontSize: '1.2rem',
                            fontWeight: 700
                          }}
                        >
                          {testimonial.avatar}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: colors.text
                            }}
                          >
                            {testimonial.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: colors.textSecondary }}
                          >
                            {testimonial.role}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: colors.primary,
                              fontWeight: 500
                            }}
                          >
                            {testimonial.company}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </AnimatedCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </AnimatedSection>

        {/* CTA Section with Animation */}
        <CTASection
          ref={ctaRef}
          id="cta-section"
          darkMode={darkMode}
          sx={{
            opacity: visibleSections.has('cta-section') ? 1 : 0,
            transform: visibleSections.has('cta-section') ? 'translateY(0)' : 'translateY(50px)',
            animation: visibleSections.has('cta-section') ? `${slideInFromBottom} 0.8s ease-out forwards` : 'none',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <Container maxWidth="md">
            <AnimatedSection
              darkMode={darkMode}
              isVisible={visibleSections.has('cta-section')}
              animationDirection="top"
              textAlign="center"
            >
              <Typography
                variant="h2"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                }}
              >
                Ready to Start Speaking Naturally?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                }}
              >
                Join over 85,000 learners experiencing convenient, judgment-free language practice
              </Typography>
            </AnimatedSection>
            <AnimatedSection
              darkMode={darkMode}
              isVisible={visibleSections.has('cta-section')}
              animationDirection="bottom"
              delay={0.3}
              display="flex"
              gap={2}
              justifyContent="center"
              flexWrap="wrap"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayIcon />}
                sx={{
                  bgcolor: 'white',
                  color: colors.primary,
                  fontWeight: 600,
                  '&:hover': { bgcolor: 'grey.100' },
                  px: 4,
                  py: 1.5,
                  borderRadius: 3
                }}
              >
                Try Demo Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<MessageIcon />}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                  color: 'white',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: 2
                  },
                  px: 4,
                  py: 1.5,
                  borderRadius: 3
                }}
              >
                Start Chatting
              </Button>
            </AnimatedSection>
          </Container>
        </CTASection>

        {/* Footer */}
        <Footer darkMode={darkMode}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <Typography
                  variant="h4"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  PolyglotBot
                </Typography>
                <Typography
                  variant="body2"
                  color="grey.400"
                  sx={{
                    mb: 2,
                    lineHeight: 1.6,
                  }}
                >
                  Natural, convenient AI conversations for effortless language learning
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Product
                </Typography>
                <Stack spacing={1}>
                  {['Features', 'Demo', 'Languages', 'Analytics'].map((item) => (
                    <Typography
                      key={item}
                      variant="body2"
                      color="grey.400"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { color: 'white' }
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Company
                </Typography>
                <Stack spacing={1}>
                  {['About', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item) => (
                    <Typography
                      key={item}
                      variant="body2"
                      color="grey.400"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { color: 'white' }
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Connect
                </Typography>
                <Stack spacing={1}>
                  {['Help Center', 'Community', 'Social Media', 'Newsletter'].map((item) => (
                    <Typography
                      key={item}
                      variant="body2"
                      color="grey.400"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { color: 'white' }
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Grid>
            </Grid>
            <Divider sx={{ my: 4, borderColor: 'grey.800' }} />
            <Box textAlign="center">
              <Typography variant="body2" color="grey.400">
                © 2025 PolyglotBot. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Footer>
      </Box>
    </ThemeProvider>
  );
}

export default Home;
