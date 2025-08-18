import React from 'react';
import { Avatar } from '@mui/material';
import Flag from 'react-flagpack'

// Fallback flag image for organizations not included in react-flagpack (e.g., Arab League)
const ARAB_LEAGUE_FLAG_URL = 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Flag_of_the_Arab_League.svg';

const LANGUAGE_CODES: Record<string, string> = {
  "Afrikaans": "ZA",
  // Use a custom image for Arabic (Arab League) instead of a country flag
  "Arabic": "ARAB_LEAGUE",
  "Armenian": "AM",
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

interface LanguageAvatarProps {
  primaryLanguage: string;
  translatedLanguage: string;
}

const LanguageAvatar: React.FC<LanguageAvatarProps> = ({ primaryLanguage, translatedLanguage }) => {
  const primaryCode = LANGUAGE_CODES[primaryLanguage] || primaryLanguage.toLowerCase();
  const translatedCode = LANGUAGE_CODES[translatedLanguage] || translatedLanguage.toLowerCase();

  return (
    <Avatar sx={{
      width: 50,
      height: 50,
      position: 'relative',
      overflow: 'hidden',
      bgcolor: 'transparent'
    }}>
      {primaryCode === 'ARAB_LEAGUE' ? (
        <span style={{ display: 'inline-flex', width: 22,  alignItems: 'center', justifyContent: 'center' }}>
          <img src={ARAB_LEAGUE_FLAG_URL} alt="Arab League" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </span>
      ) : (
        <Flag code={primaryCode} size="m" />
      )}
      {translatedCode === 'ARAB_LEAGUE' ? (
        <span style={{ display: 'inline-flex', width: 22, alignItems: 'center', justifyContent: 'center' }}>
          <img src={ARAB_LEAGUE_FLAG_URL} alt="Arab League" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </span>
      ) : (
        <Flag code={translatedCode} size="m" />
      )}
    </Avatar>
  );
};

export default LanguageAvatar; 