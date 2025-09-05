import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Avatar,
  Chip,
  Paper,
  LinearProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TranslateIcon from '@mui/icons-material/Translate';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import FlashcardReview from './FlashcardReview';

interface ReviewSession {
  id: string;
  chatName: string;
  targetLanguage: string;
  translationLanguage: string;
  targetFlag: string;
  translationFlag: string;
  reviewedWords: number;
  totalWords: number;
  createdDate: string;
  words: Array<{
    id: string;
    word: string;
    translation: string;
    sentence: string;
  }>;
}

const StyledCard = styled(Paper)(() => ({
  display: 'flex',
  flexDirection: 'row',
  minHeight: '160px',
  marginBottom: '24px',
  borderRadius: '20px',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    '& .flag-section': {
      transform: 'scale(1.1)',
    },
    '& .review-button': {
      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
      transform: 'scale(1.05)',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)',
    borderRadius: '20px 20px 0 0',
  },
}));

const FlagSection = styled(Box)<{ targetCountry: string }>(({ targetCountry }) => ({
  width: '300px',
  minHeight: '160px',
  alignSelf: 'stretch',
  position: 'relative',
  backgroundImage: targetCountry == "arab" ? `url("https://upload.wikimedia.org/wikipedia/commons/2/2b/Flag_of_the_Arab_League.svg")` : `url("https://flagcdn.com/w640/${targetCountry}.png")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  transition: 'transform 0.4s ease-in-out',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
  },
}));

const ContentSection = styled(Box)({
  flex: 1,
  padding: '24px 28px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  background: 'rgba(255, 255, 255, 0.95)',
  minHeight: '160px',
});

const LanguageChip = styled(Chip)(() => ({
  fontWeight: '600',
  fontSize: '0.75rem',
  height: '28px',
  borderRadius: '14px',
  '& .MuiChip-icon': {
    marginLeft: '8px',
  },
}));

const ProgressContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginTop: '12px',
});

const StyledLinearProgress = styled(LinearProgress)(() => ({
  height: '10px',
  borderRadius: '15px',
  backgroundColor: '#e8f5e8',
  border: '1px solid rgba(76, 175, 80, 0.2)',
  '& .MuiLinearProgress-bar': {
    borderRadius: '5px',
    backgroundColor: '#4caf50',
    background: 'linear-gradient(90deg, #81c784 0%, #4caf50 50%, #388e3c 100%)',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  },
}));

const ReviewButton = styled(Button)({
  borderRadius: '16px',
  textTransform: 'none',
  fontWeight: '700',
  fontSize: '0.9rem',
  minWidth: '120px',
  height: '44px',
  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
  },
});

const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: '24px',
  marginBottom: '32px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1976d2',
    },
  },
});

const StyledSelect = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#ffffff',
  },
});

interface Chat {
  id: string;
  chat: string;
  language: string;
  translatedLanguage: string;
  messages: Array<{
    id: string;
    content: string;
    role: string;
    translated: string;
    addedAt: any;
  }>;
}

interface ReviewProps {
  chats: Chat[];
}

function Review({ chats }: ReviewProps) {
  const [selectedSession, setSelectedSession] = useState<ReviewSession | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [translatedLanguageFilter, setTranslatedLanguageFilter] = useState('all');

  // Function to get country codes for flags
  const getCountryCode = (language: string): string => {
    const languageToCountry: { [key: string]: string } = {
      "Arabic": "arab",
      "Azerbaijani": "AZ",
      "Belarusian": "BY",
      "Bengali": "BD",
      "Bosnian": "BA",
      "Bulgarian": "BG",
      "Catalan": "AD",
      "Chinese": "CN",
      "Croatian": "HR",
      "Czech": "CZ",
      "Danish": "DK",
      "Dutch": "NL",
      "English": "US",
      "Estonian": "EE",
      "Finnish": "FI",
      "French": "FR",
      "German": "DE",
      "Greek": "GR",
      "Hebrew": "IL",
      "Hindi": "IN",
      "Hungarian": "HU",
      "Icelandic": "IS",
      "Indonesian": "ID",
      "Italian": "IT",
      "Japanese": "JP",
      "Kazakh": "KZ",
      "Korean": "KR",
      "Latvian": "LV",
      "Lithuanian": "LT",
      "Macedonian": "MK",
      "Malay": "MY",
      "Marathi": "IN",
      "Nepali": "NP",
      "Norwegian": "NO",
      "Persian": "IR",
      "Polish": "PL",
      "Portuguese": "BR",
      "Romanian": "RO",
      "Russian": "RU",
      "Serbian": "RS",
      "Slovak": "SK",
      "Slovenian": "SI",
      "Spanish": "ES",
      "Swahili": "TZ",
      "Swedish": "SE",
      "Tagalog": "PH",
      "Tamil": "IN",
      "Thai": "TH",
      "Turkish": "TR",
      "Ukrainian": "UA",
      "Urdu": "PK",
      "Vietnamese": "VN",
      "Welsh": "GB-WLS"
    };

    const countryCode = languageToCountry[language];
    return countryCode.toLowerCase();
  };

  // Get unique languages for filter dropdowns
  const uniqueLanguages = useMemo(() => {
    if (!Array.isArray(chats)) return [];
    return [...new Set(chats.map(chat => chat.language))].sort();
  }, [chats]);

  const uniqueTranslatedLanguages = useMemo(() => {
    if (!Array.isArray(chats)) return [];
    return [...new Set(chats.map(chat => chat.translatedLanguage))].sort();
  }, [chats]);

  // Filter chats based on search term and language filters
  const filteredChats = useMemo(() => {
    if (!Array.isArray(chats)) return [];

    return chats.filter(chat => {
      const matchesSearch = searchTerm === '' ||
        chat.chat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.translatedLanguage.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLanguage = languageFilter === 'all' || chat.language === languageFilter;
      const matchesTranslatedLanguage = translatedLanguageFilter === 'all' || chat.translatedLanguage === translatedLanguageFilter;

      return matchesSearch && matchesLanguage && matchesTranslatedLanguage;
    });
  }, [chats, searchTerm, languageFilter, translatedLanguageFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setLanguageFilter('all');
    setTranslatedLanguageFilter('all');
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== '' || languageFilter !== 'all' || translatedLanguageFilter !== 'all';

  const handleStartReview = (session: ReviewSession) => {
    setSelectedSession(session);
  };

  const handleBackToSessions = () => {
    setSelectedSession(null);
  };

  if (selectedSession) {
    return (
      <FlashcardReview
        session={selectedSession}
        onBack={handleBackToSessions}
      />
    );
  }

  return (
    <Box sx={{
      margin: 0,
      p: { xs: 2, md: 4 },
      bgcolor: 'grey.50',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            textAlign: 'center',
            mb: 4
          }}
        >
          Review Sessions
        </Typography>

        {/* Filter Controls */}
        <FilterContainer elevation={0}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: '600', color: 'text.primary' }}>
              Filter Sessions
            </Typography>
            {hasActiveFilters && (
              <Tooltip title="Clear all filters">
                <IconButton onClick={clearFilters} sx={{ ml: 'auto' }}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                placeholder="Search by chat name or language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchTerm('')}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <StyledSelect fullWidth>
                <InputLabel>Target Language</InputLabel>
                <Select
                  value={languageFilter}
                  label="Target Language"
                  onChange={(e) => setLanguageFilter(e.target.value)}
                >
                  <MenuItem value="all">All Languages</MenuItem>
                  {uniqueLanguages.map((language) => (
                    <MenuItem key={language} value={language}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </StyledSelect>
            </Grid>

            <Grid item xs={12} md={3}>
              <StyledSelect fullWidth>
                <InputLabel>Translation Language</InputLabel>
                <Select
                  value={translatedLanguageFilter}
                  label="Translation Language"
                  onChange={(e) => setTranslatedLanguageFilter(e.target.value)}
                >
                  <MenuItem value="all">All Languages</MenuItem>
                  {uniqueTranslatedLanguages.map((language) => (
                    <MenuItem key={language} value={language}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </StyledSelect>
            </Grid>
          </Grid>

          {hasActiveFilters && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Active filters:
              </Typography>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  size="small"
                  onDelete={() => setSearchTerm('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {languageFilter !== 'all' && (
                <Chip
                  label={`Target: ${languageFilter}`}
                  size="small"
                  onDelete={() => setLanguageFilter('all')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {translatedLanguageFilter !== 'all' && (
                <Chip
                  label={`Translation: ${translatedLanguageFilter}`}
                  size="small"
                  onDelete={() => setTranslatedLanguageFilter('all')}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </FilterContainer>

        {/* Results Summary */}
        {Array.isArray(chats) && chats.length > 0 && (
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Showing {filteredChats.length} of {chats.length} sessions
            </Typography>
            {filteredChats.length === 0 && hasActiveFilters && (
              <Button
                variant="outlined"
                size="small"
                onClick={clearFilters}
                startIcon={<ClearIcon />}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        )}

        <Box sx={{ maxWidth: '100%' }}>
          {Array.isArray(chats) && chats.length > 0 ? (
            filteredChats.length > 0 ? filteredChats.map((chat) => {
              // Calculate progress based on messages (mock calculation)
              const totalWords = chat.messages?.length || 0;
              const reviewedWords = Math.floor(totalWords * 0.6); // Mock 60% completion
              const progressPercentage = totalWords > 0 ? (reviewedWords / totalWords) * 100 : 0;
              const targetCountry = getCountryCode(chat.language);

              return (
                <StyledCard key={chat.id} elevation={0}>
                  <FlagSection targetCountry={targetCountry} className="flag-section" />

                  <ContentSection>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h5"
                            component="h2"
                            sx={{
                              fontWeight: '700',
                              fontSize: '1.4rem',
                              color: '#1a1a1a',
                              mb: 1,
                              letterSpacing: '-0.02em',
                            }}
                          >
                            {chat.chat}
                          </Typography>

                          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2 }}>
                            <LanguageChip
                              label={chat.language}
                              color="primary"
                              size="small"
                              icon={<Avatar sx={{ width: 18, height: 18, fontSize: '0.8rem' }}>🌍</Avatar>}
                            />
                            <TranslateIcon sx={{ fontSize: 18, color: '#666', opacity: 0.7 }} />
                            <LanguageChip
                              label={chat.translatedLanguage}
                              variant="outlined"
                              size="small"
                              icon={<Avatar sx={{ width: 18, height: 18, fontSize: '0.8rem' }}>🌍</Avatar>}
                            />
                          </Box>
                        </Box>

                        <ReviewButton
                          variant="contained"
                          className="review-button"
                          startIcon={<PlayArrowIcon />}
                          onClick={() => handleStartReview({
                            id: chat.id,
                            chatName: chat.chat,
                            targetLanguage: chat.language,
                            translationLanguage: chat.translatedLanguage,
                            targetFlag: '🌍',
                            translationFlag: '🌍',
                            reviewedWords,
                            totalWords,
                            createdDate: new Date().toISOString().split('T')[0],
                            words: chat.messages?.map(msg => ({
                              id: msg.id,
                              word: msg.content.split(' ')[0] || msg.content,
                              translation: msg.translated || '',
                              sentence: msg.content
                            })) || []
                          })}
                        >
                          Start Review
                        </ReviewButton>
                      </Box>

                    </Box>
                    <Typography>Words/Phrases Reviewed: <b>{reviewedWords}/{totalWords}</b></Typography>
                    <ProgressContainer>
                      <StyledLinearProgress
                        variant="determinate"
                        value={progressPercentage}
                        sx={{ flex: 1 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: '700',
                          color: '#4caf50',
                          minWidth: '60px',
                          textAlign: 'right',
                          fontSize: '0.9rem',
                        }}
                      >
                        {Math.round(progressPercentage)}%
                      </Typography>
                    </ProgressContainer>
                  </ContentSection>
                </StyledCard>
              );
            }) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No sessions match your filters
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search terms or clearing the filters
                </Typography>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  sx={{ mt: 2 }}
                  startIcon={<ClearIcon />}
                >
                  Clear All Filters
                </Button>
              </Box>
            )
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No chats available for review
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Create some chats first to see them here for review
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default Review;