import { getDatabase, ref, push, onValue, get, update, set, Database, child } from 'firebase/database';
import { generateId } from '../helper';

// Encoding algorithm
// A - B --> A - B
// B - A --> A - B
// not sure if this works per se
function encodePathForMsg (currentId: string, endUserId: string) {
    let whichGreater = currentId > endUserId;
    if (whichGreater) {
        return currentId + "/" + endUserId
    } else {
        return endUserId + "/" + currentId
    }
}

// Setup callback function whenever firebase updates (new message sent/received)
export function onMessagingUpdate (
    db: Database, 
    currentId: string, 
    endUserId: string, 
    callback: (data: any) => void
) {
  let ref_msg = ref(db, "messaging/" + encodePathForMsg(currentId, endUserId))
  onValue(ref_msg, (snapshot) => {
    let data = snapshot.val() || {a: []};
    // order by "date"        
    data = Object.values(data)
    data.sort((a:any, b:any) => a.date - b.date)

    callback(data);
  });
}

// Send message to the database from currentId to endUserId
export function sendMessage (
    db: Database,
    currentId: string,
    endUserId: string, 
    msg: string
) {
  let ref_msg = ref(db, "messaging/" + encodePathForMsg(currentId, endUserId))
  push(ref_msg, {
    msg: msg,
    date: Date.now(),
    from: currentId
  })
}