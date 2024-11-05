import { getDatabase, ref, push, child, get, update, Database, DataSnapshot, set } from 'firebase/database';
import { generateId } from '../helper';

export function signUpUsers (
    db:Database, 
    name:string,
    email:string,
    phone:string,
    interests: string[]
) {
    let ref_users = ref(db, "users")
    push(ref_users, {
        userId: generateId(),
        name: name,
        email: email,
        phone: phone,
        interests: interests
    })
}

export async function getUserInfo(db: Database, userId: string) {
    const ref_users = ref(db, "users");

    try {
        const snapshot = await get(child(ref_users, userId));
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("No user found with this userId.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}
