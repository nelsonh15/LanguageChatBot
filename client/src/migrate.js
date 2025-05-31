import { initializeApp } from 'firebase/app';
import { getFirestore, collectionGroup, addDoc, setDoc, doc, collection, getDocs, query } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCDDhPdzTjaWLuAxrV5Xnc_CJj0OWz4ApM",
  authDomain: "language-chatbot-eca18.firebaseapp.com",
  projectId: "language-chatbot-eca18",
  storageBucket: "language-chatbot-eca18.appspot.com",
  messagingSenderId: "258884115271",
  appId: "1:258884115271:web:fec24e3d1017e9ca3b8a62",
  measurementId: "G-4TH6JHQWYJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export async function getUserChats() {
  try {
    
    const usersQuery = collectionGroup(db, 'users');
    const userDocs = await getDocs(usersQuery);
    
    const users = userDocs.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const allUserChats = [];

    for (const user of users) {
      const userChat = await getDocs(query(collection(db, `users/${user.id}/chats`)));
      
      const temp = userChat.docs.map(doc => ({
        chatID: doc.id,
        ChatName: doc.ChatName,
        Language: doc.Language,
        TranslatedLanguage: doc.TranslatedLanguage,
        createdAt: doc.createdAt,
        createdBy: user.email,
        createdBy_userID: user.id,
        ...doc.data()
      }));
      allUserChats.push(...temp);
    }
    return allUserChats;
  } catch (error) {
    console.error("Error getting chats:", error.message);
    return null;
  }
}

export async function getUserMessages() {
  try {
    
    const usersQuery = collectionGroup(db, 'users');
    const userDocs = await getDocs(usersQuery);
    
    const users = userDocs.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const allUserMessages = [];
    for (const user of users) {
      const userChats = {};
      userChats["createdBy"] = user.email;
      userChats["createdBy_userID"] = user.id;

      const userChat = await getDocs(query(collection(db, `users/${user.id}/chats`)));
      const chats = userChat.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      for (const chat of chats) {
        const userMessages = await getDocs(query(collection(db, `users/${user.id}/chats/${chat.id}/messages`)));
        const messages = userMessages.docs.map(doc => ({
          id: doc.id,
          chatID: chat.id,
          createdBy: user.email,
          createdBy_userID: user.id,
          ...doc.data()
        }));
        allUserMessages.push(...messages);
      }
    }
  return allUserMessages;
  } catch (error) {
    console.error("Error getting chats:", error.message);
    return null;
  }
}

export async function migrateUserChats() {
  try {
    const userChats = await getUserChats();
    // Create chats collection and add each chat as a document
    for (const chat of userChats) {
      await setDoc(doc(db, 'chats', chat.chatID), {
        ...chat,
      });
    }

    const userMessages = await getUserMessages();
    // Create messages collection and add each message as a document
    for (const message of userMessages) {
      await addDoc(collection(db, 'messages'), {
        ...message,
      });
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error("Error migrating chats:", error.message);
    return null;
  }
}


migrateUserChats()