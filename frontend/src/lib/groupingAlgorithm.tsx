
import { kmeans } from "ml-kmeans"
import { getParty } from "./API/parties"
import { getUserMetadata } from "./API/users"
import { child, ref, update, Database } from "firebase/database"

const numberOfGroups = 2 // this could be custom

export async function grouping_algo (db: Database, partyId:string) {
  let partyData = await getParty(db, partyId) as any

  // get list of partipants ids
  let participantsIDs = partyData.participants.map((value:any) => value.profileId) as string[]

  if (participantsIDs.length < numberOfGroups) {
    // don't do any calculations when the number of partipants has no number of groups
    return
  }

  // get all the person's ids 
  let dataEmbeds = [] as any[]
  for (let i = 0; i < participantsIDs.length; i++) {
    let retData = await getUserMetadata(db, participantsIDs[i])
    dataEmbeds.push(retData.embedding[0])
  }

  let kmeans_result = kmeans(dataEmbeds, numberOfGroups, {} ) 
  let clusters = kmeans_result.clusters
  let clusterResult: {[id: string]: number} = {}
  let clusterCount: {[id: number]: number} = {}

  for (let i = 0; i < participantsIDs.length; i++) {
    clusterResult[participantsIDs[i]] = clusters[i]
    if (!(clusters[i] in clusterCount)) {
      clusterCount[clusters[i]] = 1
    } else {
      clusterCount[clusters[i]] += 1
    }
  }

  // get whether one person is alone
  // idone --> 0
  // idtwo --> 1
  // idthree --> 1


  update(child(ref(db, "parties"), partyId), {
    clusterResult: clusterResult
  })

}