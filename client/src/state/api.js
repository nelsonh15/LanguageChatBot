/* eslint-disable no-unused-vars */
import { secureApiCall } from "../services/apiService.tsx";
import SessionExpired from '../components/SessionExpired';

export async function getAIText(inputText, inputLanguage) {
  try {
    const response = await secureApiCall(
      `${import.meta.env.VITE_BASE_URL}/api/openai/text`,
      'POST',
      { text: inputText, language: inputLanguage },
    );

    if (response.ok) {
      const data = await response.json();
      return data.text;
    }
    else {
      console.error("Error from server: Status Code " + response.status);
    }

  } catch (error) {
    console.error("Error sending message", error);
  }
}

export async function translatedText(inputText, inputLanguage, translatedLang) {
  try {
    const response = await secureApiCall(
      `${import.meta.env.VITE_BASE_URL}/api/openai/translated`,
      'POST',
      { text: inputText, language: inputLanguage, translated: translatedLang },
    );

    if (response.ok) {
      const data = await response.json();
      return data.text;
    }
    else {
      console.error("Error from server: Status Code " + response.status);
    }
  } catch (error) {
    console.error("Error sending message", error);
  }
}

export async function chatCompletion(messages, inputLanguage) {
  try {
    const response = await secureApiCall(
      `${import.meta.env.VITE_BASE_URL}/api/openai/chat-completion`,
      'POST',
      { messages: messages, language: inputLanguage },
    );

    if (response.ok) {
      const data = await response.json();
      return data.text;
    }
    else {
      console.error("Error from server: Status Code " + response.status);
    }
  } catch (error) {
    console.error("Error sending message", error);
  }
}

export async function handleTextToSpeech(text, setAudioUrl) {
  if (localStorage.getItem(text) != null) {
    const base64Audio = localStorage.getItem(text);
    const byteCharacters = atob(base64Audio);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const audioBlob = new Blob([byteArray], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioUrl(audioUrl);
  }
  else {
    try {
      const response = await secureApiCall(
        `${import.meta.env.VITE_BASE_URL}/api/openai/text-to-speech`,
        'POST',
        { text: text },
      );

      if (response.ok) {
        const audioBlob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = function () {
          const base64Audio = reader.result.split(',')[1];
          localStorage.setItem(text, base64Audio);
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
        }
      }
      else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error in text to speech conversion', error);
    }
  }
}

export async function handleSpeechToText(formData) {
  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Transcription failed with status ${response.status}`);
    }

    const data = await response.json();
    const newTranscript = data.text;
    return newTranscript;
  }
  catch (error) {
    console.error("Transcription error:", error);
  }
}