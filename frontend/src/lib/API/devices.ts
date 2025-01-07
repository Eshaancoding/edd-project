import { getDatabase, ref, push, child, get, update, Database, DataSnapshot, set, onValue } from 'firebase/database';
import { generateId } from '../helper';
import { type Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

// if connected to device, it will return a string (the device id). 
// If it not, it will return an Object
// Setup callback function whenever firebase updates (new device available/taken)
export async function onAvailableDevices (
    db: Database, 
    userId: string,
    partyId: string,
    fnCallback: (data: any, isConnected: boolean) => void
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

        fnCallback(connectedDevice.length > 0 ? connectedDevice : finalData, connectedDevice.length > 0) 
    }) 
}

// Update firebase database to unregister device
export async function unregisterDevice (
    db: Database,
    deviceId: string
) {
    let data:any = (await get(ref(db, "devices"))).val() 

    data[deviceId] = {
        "partyId": "None",
        "userId": "None",
        "display": "",
        "name": ""
    }
    await set(ref(db, "devices"), data)
}

// Update firebase database to register device
export async function registerDevice (
    db: Database,
    name: string,
    display: string,
    userId: string,
    partyId: string,
    deviceId: string
)
{
    let data:any = (await get(ref(db, "devices"))).val() 

    data[deviceId] = {
        "partyId": partyId,
        "userId": userId,
        "display": display,
        "name": name
    }
    await set(ref(db, "devices"), data)
}

// Update the display name for the current (connected) device id.
export async function updateDisplayName (
    db: Database,
    deviceId: string,
    displayName: string
) {
    let data:any = (await get(ref(db, "devices"))).val() 
    data[deviceId]["display"] = displayName 
    await set(ref(db, "devices"), data)
}