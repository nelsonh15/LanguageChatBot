import { initializeApp } from 'firebase/app';
import {getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User} from 'firebase/auth';
import { getFirestore, addDoc, doc, setDoc, collection, getDocs, deleteDoc, serverTimestamp, orderBy, query, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut() {
  return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  
  return onAuthStateChanged(auth, async (user) => {
    callback(user);
    if (user) {
      // User is signed in, so store their information in Firestore
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          user_id: user.uid,
          email: user.email,
          // Add any other user information you want to store
        });
      } catch (error) {
        console.error('Error storing user information in Firestore:', error);
      }
    }
  });
}

export async function getUserChatsandMessages(user) {
  try {
    const chatsRef = collection(db, `users/${user.uid}/chats`);
    const chatSnapshot = await getDocs(query(chatsRef, orderBy('createdAt', 'asc')));
    
    const chats = {};
    await Promise.all(chatSnapshot.docs.map(async (chatDoc) => {
      const messagesRef = collection(db, `users/${user.uid}/chats/${chatDoc.id}/messages`);
      const messageSnapshot = await getDocs(query(messagesRef, orderBy('addedAt', 'asc')));

      const messages = []
      messageSnapshot.docs.forEach((messageDoc) => {
        messages.push({ id: messageDoc.id, ...messageDoc.data() });
      });

      chats[chatDoc.id] = {
        id: chatDoc.id,
        chat: chatDoc.data().ChatName, // Assuming you want to name the chat like this
        messages: messages
      };
    }));
    return chats;
  }

  catch (error) {
    console.log(error.message);
    return null; // Modify error handling as needed
  }
}

export async function getMessages(user, chatId) {
  try {
    const messagesRef = collection(db, `users/${user.uid}/chats/${chatId}/messages`);
    const messagesSnapshot = await getDocs(query(messagesRef, orderBy('addedAt', 'asc')));
    const messages = [];
    messagesSnapshot.docs.forEach((messageDoc) => {
      messages.push({ role: messageDoc.data().role, content: messageDoc.data().content })
    })
    return messages;
  }
  catch(error) {
    console.log(error.message);
    return null;
  }
}

export async function getChosenChatLanguages(user, chatId) {
  try {
    const chatsRef = doc(db, `users/${user.uid}/chats/`, chatId)
    const docSnap = await getDoc(chatsRef)
    const data = [];
    data.push(docSnap.data().Language)
    data.push(docSnap.data().TranslatedLanguage)
    return data;
  }
  
  catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function addChat(user, chatName, language, translatedLang) {
  try {
    const userChatsRef = collection(db, `users/${user.uid}/chats`);
    const chatSnapshot = await addDoc(userChatsRef, {});

    // Determine the next chat ID
    const nextChatId = chatSnapshot.id;

    // Create a reference for the new chat document
    const newChatRef = doc(db, `users/${user.uid}/chats/${nextChatId}`);

    // Set the new chat document with an empty messages collection
    await setDoc(newChatRef, { createdAt: serverTimestamp(), ChatName: chatName, Language: language, TranslatedLanguage: translatedLang});
    
    const messagesRef = collection(db, `users/${user.uid}/chats/${nextChatId}/messages`);
    
    return nextChatId; // Returning the ID of the new chat
  } 

  catch(error) {
    console.log(error.message);
    return null;
  }
}

export async function deleteChat(user, chatId) {
  try {
     // Delete messages inside the chat
     const messagesRef = collection(db, `users/${user.uid}/chats/${chatId}/messages`);
     const messagesSnapshot = await getDocs(messagesRef);
 
     // Delete each message document individually
     for (const messageDoc of messagesSnapshot.docs) {
       await deleteDoc(messageDoc.ref);
     }
 
     // Delete the chat document
     const chatRef = doc(db, `users/${user.uid}/chats/${chatId}`);
     await deleteDoc(chatRef);
 
     return true;
  }

  catch(error) {
    console.log(error.message);
    return null;
  }
}

export async function addMessages(user, chatId, id, sender, text, translated) {
  try {
    const messageRef = collection(db, `users/${user.uid}/chats/${chatId}/messages`)
    const messageDocRef = await addDoc(messageRef, {
      id: id,
      role: sender,
      content: text,
      translated: translated,
      addedAt: serverTimestamp()
    });
  }

  catch(error) {
    console.log(error.messages);
    return null;
  }
}

export { db };