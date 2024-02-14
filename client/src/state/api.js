/* eslint-disable no-unused-vars */
import { secureApiCall, fetchIdToken } from "../services/apiService.tsx";

export async function getAIText(inputText, inputLanguage) {
  try {
    const idToken = await fetchIdToken(); // Ensure you call fetchIdToken() to get the current ID token
    console.log(idToken)
    if (!idToken) {
      throw new Error('User is not authenticated');
    }

    const response = await secureApiCall(`${import.meta.env.VITE_BASE_URL}/openai/text`, 'POST', { text: inputText, language: inputLanguage });

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
  const idToken = await fetchIdToken(); // Ensure you call fetchIdToken() to get the current ID token
  if (!idToken) {
    throw new Error('User is not authenticated');
  }
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/openai/translated`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ text: inputText, language: inputLanguage, translated: translatedLang }),
    });

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
  const idToken = await fetchIdToken(); // Ensure you call fetchIdToken() to get the current ID token
  if (!idToken) {
    throw new Error('User is not authenticated');
  }
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/openai/chat-completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ messages: messages, language: inputLanguage }),
    });
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
  const idToken = await fetchIdToken(); // Ensure you call fetchIdToken() to get the current ID token
  if (!idToken) {
    throw new Error('User is not authenticated');
  }
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/openai/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ text: text }),
    });

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
