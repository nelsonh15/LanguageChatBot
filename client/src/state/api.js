/* eslint-disable no-unused-vars */
import { secureApiCall } from "../services/apiService.tsx";

export async function getAIText(inputText, inputLanguage) {
  try {
    const response = await secureApiCall(`${import.meta.env.VITE_BASE_URL}/api/openai/text`, 'POST', { text: inputText, language: inputLanguage });

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
    const response = await secureApiCall(`${import.meta.env.VITE_BASE_URL}/api/openai/translated`, 'POST', { text: inputText, language: inputLanguage, translated: translatedLang });

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
    const response = await secureApiCall(`${import.meta.env.VITE_BASE_URL}/api/openai/chat-completion`, 'POST', { messages: messages, language: inputLanguage });

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
  try {
    const response = await secureApiCall(`${import.meta.env.VITE_BASE_URL}/api/openai/text-to-speech`, 'POST', { text: text });

    if (response.ok) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    }
    else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Error in text to speech conversion', error);
  }
}
