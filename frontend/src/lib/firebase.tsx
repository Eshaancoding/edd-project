import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

export function get_app () {
  const firebaseConfig = {
    apiKey: "AIzaSyCt4_VJ1h6DndF1143QZnUqngXGxTJzSPU",
    authDomain: "edd-project-f9d25.firebaseapp.com",
    databaseURL: "https://edd-project-f9d25-default-rtdb.firebaseio.com",
    projectId: "edd-project-f9d25",
    storageBucket: "edd-project-f9d25.firebasestorage.app",
    messagingSenderId: "345725068077",
    appId: "1:345725068077:web:06a02af0b6c686cea4a9a4",
    measurementId: "G-G572SP3XFL"
  };
  // Initialize Firebase
  let app = initializeApp(firebaseConfig);
  let db = getDatabase(app);

  return [app, db]
}