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

    let ref_users = ref(db, "users") // this is the metadata
    push(ref_users, {
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
    const ref_users = ref(db, "users"); //

    try {
        const snapshot = await get(child(ref_users, userId));
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("No user found with this userId.");
            return null; // hi dog
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}
