import React from 'react';
import { Avatar } from '@mui/material';

const LANGUAGE_CODES: Record<string, string> = {
  "Afrikaans": "AF",
  "Arabic": "AR",
  "Armenian": "HY",
  "Azerbaijani": "AZ",
  "Belarusian": "BE",
  "Bosnian": "BS",
  "Bulgarian": "BG",
  "Catalan": "CA",
  "Chinese": "ZH",
  "Croatian": "HR",
  "Czech": "CS",
  "Danish": "DA",
  "Dutch": "NL",
  "English": "EN",
  "Estonian": "ET",
  "Finnish": "FI",
  "French": "FR",
  "Galician": "GL",
  "German": "DE",
  "Greek": "EL",
  "Hebrew": "HE",
  "Hindi": "HI",
  "Hungarian": "HU",
  "Icelandic": "IS",
  "Indonesian": "ID",
  "Italian": "IT",
  "Japanese": "JA",
  "Kannada": "KN",
  "Kazakh": "KK",
  "Korean": "KO",
  "Latvian": "LV",
  "Lithuanian": "LT",
  "Macedonian": "MK",
  "Malay": "MS",
  "Marathi": "MR",
  "Maori": "MI",
  "Nepali": "NE",
  "Norwegian": "NO",
  "Persian": "FA",
  "Polish": "PL",
  "Portuguese": "PT",
  "Romanian": "RO",
  "Russian": "RU",
  "Serbian": "SR",
  "Slovak": "SK",
  "Slovenian": "SL",
  "Spanish": "ES",
  "Swahili": "SW",
  "Swedish": "SV",
  "Tagalog": "TL",
  "Tamil": "TA",
  "Thai": "TH",
  "Turkish": "TR",
  "Ukrainian": "UK",
  "Urdu": "UR",
  "Vietnamese": "VI",
  "Welsh": "CY"
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
      width: 40,
      height: 40,
      position: 'relative',
      overflow: 'hidden',
      bgcolor: 'transparent'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Background split */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, 
            #1ebefc 50%, 
            #ffffff 50%)`
        }} />

        {/* Text container */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Primary language code */}
          <div style={{
            position: 'absolute',
            top: '35%',
            left: '30%',
            transform: 'translate(-50%, -50%)',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {primaryCode}
          </div>

          {/* Translated language code */}
          <div style={{
            position: 'absolute',
            bottom: '35%',
            right: '30%',
            transform: 'translate(50%, 50%)',
            color: '#000000',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {translatedCode}
          </div>
        </div>
      </div>
    </Avatar>
  );
};

export default LanguageAvatar; 