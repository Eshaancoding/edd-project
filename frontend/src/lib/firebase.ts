import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { readable } from 'svelte/store'
import type { User } from 'firebase/auth'

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

// User store
// function createUserStore() {
//     const { subscribe } = readable<User | null>(
//       undefined,
//       set => onAuthStateChanged(auth, set)
//     )
  
//     const known = new Promise<void>(resolve => {
//       let unsub = () => { }
//       unsub = subscribe(user => {
//         if (user !== undefined) {
//           resolve()
//           unsub()
//         }
//       })
//     })
    
//     return { subscribe, known }
//   }
  
//   export const user = createUserStore


// Use this
/*
    // Firebase Auth
    let currentUser = $state(undefined as Object | undefined | null);
    onMount(() => {onAuthStateChanged(auth, (user) => {
        if (user === null) goto("/login")
        else {
            currentUser = user;
        }
    })})
*/