import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "edd-project-f9d25.firebaseapp.com",
  databaseURL: "https://edd-project-f9d25-default-rtdb.firebaseio.com",
  projectId: "edd-project-f9d25",
  storageBucket: "edd-project-f9d25.firebasestorage.app",
  messagingSenderId: "345725068077",
  appId: "1:345725068077:web:06a02af0b6c686cea4a9a4",
  measurementId: "G-G572SP3XFL"
};

// Initialize Firebase
export let app = initializeApp(firebaseConfig);
export let db = getDatabase(app);
export let auth = getAuth(app)