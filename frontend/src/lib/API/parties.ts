// Parties.ts 

import { getDatabase, ref, push, onValue, get, update, set, Database, child } from 'firebase/database';
import { generateId } from '../helper';

// Setup callback function whenever firebase updates (new party created/deleted)
export function onPartiesList(db: Database, callback: (data: any) => void) {
  let ref_parties = ref(db, "parties");
  onValue(ref_parties, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  return get(ref_parties);
}

// Create a party and update in firebase
export function createParty (
  db: Database, 
  name: string, 
  description: string, 
  location: string,
  currentUser: string
) {

  let partyId = generateId()
  let ref_parties = child(ref(db, "parties"), partyId);
  set(ref_parties, {
    name: name,
    currentUser: currentUser,
    location: location,
    partyId: partyId,
    description: description,
    participants: []
  });
}

// Join a party by adding profileId to the participants list
export async function joinParty(
  db: Database, 
  name:string, 
  profileId: string, 
  partyId: string
) {
  const ref_party = child(ref(db, "parties"), partyId);

  try {
    const snapshot = await get(ref_party);
    if (snapshot.exists()) {
      const partyData = snapshot.val();
      const participants = partyData.participants || [];
      if (!participants.includes(profileId)) {
        participants.push({
          profileId: profileId,
          name: name
        });  
        await update(ref_party, { participants });
      }
    } else {
    }
  } catch (error) {
    console.error("Error joining party:", error);
  }
}

// Leave the current party (remove user id from partipants list)
export async function leaveParty (db: Database, partyId: string, profileId:string) {
  const ref_party = child(ref(db, "parties"), partyId)
  let snapshot = (await get(ref_party)).val()
  
  let parts = snapshot.participants as any[]
  let idx = parts.findIndex((value:any) => value.profileId == profileId) 
  parts.splice(idx, 1)
  snapshot.participants = parts

  let clusterResult = snapshot.clusterResult as any
  delete clusterResult[profileId]
  snapshot.clusterResult = clusterResult
  
  await set(ref_party, snapshot)
}

// Get full list of parties as a array of dictionary 
export async function getParty (db: Database, partyId: string) {
  const ref_party = child(ref(db, "parties"), partyId);
  try {
    const snapshot = await get(ref_party);
    if (snapshot.exists()) {
      const partyData = snapshot.val();
      return partyData || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting party:", error);
    return [];
  }
}

