// Users.ts

import { getDatabase, ref, push, child, get,  Database, DataSnapshot, set } from 'firebase/database';
import { generateId } from '../helper';
import { type Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getEmbeddings } from "$lib/embeddings"
import { FirebaseError } from 'firebase/app';

// Sign up user with interests and store in firebase metadata and authentication server
export async function signUpUser (
    db:Database, 
    auth:Auth,
    name:string,
    email:string,
    phone:string,
    password:string,
    bio:string,
    interests: string[],
    callbackStatus: (status:string) => void
) {
    callbackStatus("Setting up authentication...") 
    let data = await createUserWithEmailAndPassword(auth, email, password) 
    
    callbackStatus("Calculating embeddings...") 
    let ems = await getEmbeddings(interests)
    
    callbackStatus("Setting database...") 
    await set(ref(db, "users/" + data.user.uid), {
        userId: data.user.uid,
        name: name,
        email: email,
        phone: phone,
        bio: bio,
        interests: interests,
        embedding: [ems],
    })
}

// sign in with email and password
export async function signInUser (
    auth: Auth,
    email: string,
    password: string
) {

    let errorCode = "" 
    let result = await signInWithEmailAndPassword(auth, email, password).catch((reason:any) => {
        errorCode = reason.code
    });
    return errorCode.length > 0 ? errorCode : result
}

export async function getUserMetadata (db: Database, userId: string) {
    let data = await get(ref(db, "users/" + userId))
    return data.val()
}
