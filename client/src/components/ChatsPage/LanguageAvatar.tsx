import React from 'react';
import { Avatar } from '@mui/material';
import Flag from 'react-flagpack'

const LANGUAGE_CODES: Record<string, string> = {
  "Afrikaans": "ZA",
  "Arabic": "SA",
  "Armenian": "AM",
  "Azerbaijani": "AZ",
  "Belarusian": "BY",
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
  "Maori": "NZ",
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
  "Swedish": "SE",
  "Tagalog": "PH",
  "Thai": "TH",
  "Turkish": "TR",
  "Ukrainian": "UA",
  "Urdu": "PK",
  "Vietnamese": "VN"
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
      <Flag code={primaryCode} size="m" />
      <Flag code={translatedCode} size="m" />
    </Avatar>
  );
};

export default LanguageAvatar; 