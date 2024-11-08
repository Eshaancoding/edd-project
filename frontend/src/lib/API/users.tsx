import { getDatabase, ref, push, child, get, update, Database, DataSnapshot, set } from 'firebase/database';
import { generateId } from '../helper';
import { type Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export async function signUpUser (
    db:Database, 
    auth:Auth,
    name:string,
    email:string,
    phone:string,
    password:string,
    interests: string[]
) {
    let data = await createUserWithEmailAndPassword(auth, email, password) 
    
    set(ref(db, "users/" + data.user.uid), {
        userId: data.user.uid,
        name: name,
        email: email,
        phone: phone,
        interests: interests
    })
}

export async function signInUser (
    auth: Auth,
    email: string,
    password: string
) {
    let result = await signInWithEmailAndPassword(auth, email, password)
    return result.user.uid
}

export async function getUserMetadata (db: Database, userId: string) {
    let data = await get(ref(db, "users/" + userId))
    return data.val()
}
