export async function getAIText(inputText, inputLanguage) {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/openai/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText, language: inputLanguage }),
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

export async function translatedText(inputText, inputLanguage, translatedLang) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/openai/translated`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/openai/chat-completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/openai/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
