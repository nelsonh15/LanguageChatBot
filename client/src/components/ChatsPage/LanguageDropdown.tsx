import React, { useState } from "react";
import { InputLabel, TextField, Autocomplete } from '@mui/material';

const LanguageDropdown = ({ label, setDropdown }) => {
  const [value, setValue] = useState(null);

  const language_options = [
    "Afrikaans (Afrikaans)", "(Arabic) عربي", "հայ (Armenian)", "Azərbaycan (Azerbaijani)", "Беларуская (Belarusian)",
    "Bosanski (Bosnian)", "български (Bulgarian)", "Català (Catalan)", "普通话 (Chinese)", "hrvatski (Croatian)", "česky (Czech)",
    "Dansk (Danish)", "Nederlands (Dutch)", "English", "eesti (Estonian)", "suomi (Finnish)", "Français (French)",
    "Galego (Galician)", "Deutsch (German)", "ελληνικά (Greek)", "(Hebrew) עִברִית", "हिंदी (Hindi)", "magyar (Hungarian)",
    "Íslenska (Icelandic)", "Indonesia (Indonesian)", "Italiano (Italian)", "日本語 (Japanese)", "қазақ (Kazakh)",
    "한국어 (Korean)", "Latviešu (Latvian)", "Lietuvių (Lithuanian)", "македонски (Macedonian)", "Melayu (Malay)",
    "मराठी (Marathi)", "नेपाली (Nepali)", "Norsk (Norwegian)", "(Persian) فارسی", "Polski (Polish)", "Português (Portuguese)",
    "Română (Romanian)", "Русский (Russian)", "Српски (Serbian)", "Slovák (Slovak)", "slovenščina (Slovenian)", "Español (Spanish)",
    "kiswahili (Swahili)", "Svenska (Swedish)", "Tagalog (Tagalog)", "தமிழ் (Tamil)", "แบบไทย (Thai)", "Türkçe (Turkish)",
    "українська (Ukrainian)", "(Urdu) اردو", "Tiếng Việt (Vietnamese)", "cymraeg (Welsh)"
  ];

  const languages = {
    "Afrikaans (Afrikaans)": "Afrikaans", "عربي (Arabic)": "Arabic", "հայ (Armenian)": "Armenian", "Azərbaycan (Azerbaijani)": "Azerbaijani",
    "Беларуская (Belarusian)": "Belarusian", "Bosanski (Bosnian)": "Bosnian", "български (Bulgarian)": "Bulgarian", "Català (Catalan)": "Catalan",
    "普通话 (Chinese)": "Chinese", "hrvatski (Croatian)": "Croatian", "česky (Czech)": "Czech", "Dansk (Danish)": "Danish", "Nederlands (Dutch)": "Dutch",
    "English": "English", "eesti (Estonian)": "Estonian", "suomi (Finnish)": "Finnish", "Français (French)": "French", "Galego (Galician)": "Galician",
    "Deutsch (German)": "German", "ελληνικά (Greek)": "Greek", "(Hebrew) עִברִית": "Hebrew", "हिंदी (Hindi)": "Hindi", "magyar (Hungarian)": "Hungarian",
    "Íslenska (Icelandic)": "Icelandic", "Indonesia (Indonesian)": "Indonesian", "Italiano (Italian)": "Italian", "日本語 (Japanese)": "Japanese",
    "қазақ (Kazakh)": "Kazakh", "한국어 (Korean)": "Korean", "Latviešu (Latvian)": "Latvian", "Lietuvių (Lithuanian)": "Lithuanian", "македонски (Macedonian)": "Macedonian",
    "Melayu (Malay)": "Malay", "मराठी (Marathi)": "Marathi", "नेपाली (Nepali)": "Nepali", "Norsk (Norwegian)": "Norwegian", "(Persian) فارسی": "Persian",
    "Polski (Polish)": "Polish", "Português (Portuguese)": "Portuguese", "Română (Romanian)": "Romanian", "Русский (Russian)": "Russian", "Српски (Serbian)": "Serbian",
    "Slovák (Slovak)": "Slovak", "slovenščina (Slovenian)": "Slovenian", "Español (Spanish)": "Spanish", "kiswahili (Swahili)": "Swahili", "Svenska (Swedish)": "Swedish",
    "Tagalog (Tagalog)": "Tagalog", "தமிழ் (Tamil)": "Tamil", "แบบไทย (Thai)": "Thai", "Türkçe (Turkish)": "Turkish", "українська (Ukrainian)": "Ukrainian",
    "(Urdu) اردو": "Urdu", "Tiếng Việt (Vietnamese)": "Vietnamese", "cymraeg (Welsh)": "Welsh"
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setDropdown(languages[newValue]);
  };

  return (
    <>
      <Autocomplete
        value={value}
        onChange={handleChange}
        options={language_options}
        sx={{ width: 250 }} // Control the width and height of the dropdown
        renderInput={(params) => (
          <TextField {...params} label={label} />
        )}
      />
    </>
  );
}

export default LanguageDropdown;
