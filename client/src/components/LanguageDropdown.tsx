import React, { useState } from "react";
import { InputLabel, TextField, Autocomplete } from '@mui/material';

const LanguageDropdown = ({ label, setDropdown }) => {
  const [value, setValue] = useState(null);

  const languages = [
    "Afrikaans", "Arabic", "Armenian", "Azerbaijani", "Belarusian", 
    "Bosnian", "Bulgarian", "Catalan", "Chinese", "Croatian", "Czech", 
    "Danish", "Dutch", "English", "Estonian", "Finnish", "French", 
    "Galician", "German", "Greek", "Hebrew", "Hindi", "Hungarian", 
    "Icelandic", "Indonesian", "Italian", "Japanese", "Kannada", "Kazakh",
     "Korean", "Latvian", "Lithuanian", "Macedonian", "Malay", "Marathi", 
     "Maori", "Nepali", "Norwegian", "Persian", "Polish", "Portuguese", 
     "Romanian", "Russian", "Serbian", "Slovak", "Slovenian", "Spanish", 
     "Swahili", "Swedish", "Tagalog", "Tamil", "Thai", "Turkish", "Ukrainian", 
     "Urdu", "Vietnamese", "Welsh"
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setDropdown(newValue); 
  };

  return (
    <>
      <Autocomplete
        value={value}
        onChange={handleChange}
        options={languages}
        sx={{ width: 200}} // Control the width and height of the dropdown
        renderInput={(params) => (
          <TextField {...params} label={label} />
        )}
      />
    </>
  );
}

export default LanguageDropdown;
