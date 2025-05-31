import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, addDoc, doc, setDoc, collection, getDocs, deleteDoc, serverTimestamp, orderBy, query, getDoc, where } from 'firebase/firestore';

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
    const chatsRef = collection(db, 'chats');
    // Filter at database level for chats created by this user
    const chatSnapshot = await getDocs(
      query(
        chatsRef,
        where('createdBy_userID', '==', user.uid),
        orderBy('createdAt', 'asc')
      )
    );

    const chats = {};
    await Promise.all(chatSnapshot.docs.map(async (chatDoc) => {
      const chatData = chatDoc.data();
      const messagesRef = collection(db, 'messages');
      // Example of multiple where conditions for messages
      const messageSnapshot = await getDocs(
        query(
          messagesRef,
          where('chatID', '==', chatData.chatID),
          where('createdBy_userID', '==', user.uid),
          orderBy('addedAt', 'asc')
        )
      );

      const messages = []
      messageSnapshot.docs.forEach((messageDoc) => {
        messages.push({ id: messageDoc.id, ...messageDoc.data() });
      });

      chats[chatDoc.id] = {
        id: chatDoc.id,
        chat: chatData.ChatName,
        language: chatData.Language,
        translatedLanguage: chatData.TranslatedLanguage,
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

export async function addChat(user, chatName, language, translatedLang) {
  try {
    const userChatsRef = collection(db, `chats`);
    const chatSnapshot = await addDoc(userChatsRef, {});

    // Determine the next chat ID
    const nextChatId = chatSnapshot.id;

    // Create a reference for the new chat document
    const newChatRef = doc(db, `chats/${nextChatId}`);

    // Set the new chat document with an empty messages collection
    const newChat = {
      chatID: nextChatId,
      ChatName: chatName,
      Language: language,
      TranslatedLanguage: translatedLang,
      createdAt: serverTimestamp(),
      createdBy: user.email,
      createdBy_userID: user.uid
    }
    await setDoc(newChatRef, newChat);

    const newChatObject = {
      id: nextChatId,
      chat: chatName,
      language: language,
      translatedLanguage: translatedLang,
      messages: []
    }

    return [nextChatId, newChatObject];
  }

  catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function addMessages(user, chatId, id, sender, text, translated) {
  try {
    const messageRef = collection(db, 'messages')
    const messageDocRef = await addDoc(messageRef, {
      id: id,
      role: sender,
      content: text,
      translated: translated,
      addedAt: serverTimestamp(),
      chatID: chatId,
      createdBy: user.email,
      createdBy_userID: user.uid
    });

    return {
      addedAt: serverTimestamp(),
      createdBy: user.email,
      createdBy_userID: user.uid,
    }
  }

  catch (error) {
    console.log(error.messages);
    return null;
  }
}

export async function deleteChat(user, chatId) {
  try {
    // Reference the specific chat document using chatId
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      console.log("Chat not found");
      return false;
    }

    const chatData = chatDoc.data();
    if (chatData.createdBy_userID !== user.uid) {
      console.log("User does not have permission to delete this chat");
      return false;
    }

    // First, delete all messages associated with this chat
    const messagesRef = collection(db, 'messages');
    const messageSnapshot = await getDocs(
      query(
        messagesRef,
        where('chatID', '==', chatId)
      )
    );

    // Delete all messages in a batch
    const deletionPromises = messageSnapshot.docs.map(messageDoc =>
      deleteDoc(doc(db, 'messages', messageDoc.id))
    );
    await Promise.all(deletionPromises);

    // Then delete the chat document
    await deleteDoc(chatRef);

    return true;
  }

  catch (error) {
    console.log(error.message);
    return null;
  }
}


export { db };