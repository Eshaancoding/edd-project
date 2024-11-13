import { getDatabase, ref, push, child, get, update, Database, DataSnapshot, set, onValue } from 'firebase/database';
import { generateId } from '../helper';
import { type Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

// if connected to device, it will return a string (the device id). 
// If it not, it will return an Object
export async function onAvailableDevices (
    db: Database, 
    userId: string,
    partyId: string,
    callback: (data: any) => void
) {
    onValue(ref(db, "devices"), (snapshot) => {
        const data = snapshot.val();
        
        let finalData = {} as any
        let connectedDevice = ""

        Object.keys(data).forEach((key:string) => {
            if (data[key].partyId == "None" && data[key].userId == "None") {
                finalData[key] = data[key]
            }
            if (data[key].partyId == partyId && data[key].userId == userId) {
                connectedDevice = key // the device id
            }
        })

        callback(connectedDevice.length > 0 ? connectedDevice : finalData) 
    }) 
}

export async function unregisterDevice (db: Database) {

}