
import { kmeans } from "ml-kmeans"
import { getParty } from "./API/parties"
import { getUserMetadata } from "./API/users"
import { child, ref, update, Database } from "firebase/database"

const numberOfGroups = 2 // this could be custom

export async function grouping_algo (db: Database, partyId:string) {
  let partyData = await getParty(db, partyId) as any

  // get list of partipants ids
  console.log(partyData)
  let participantsIDs = partyData.participants.map((value:any) => value.profileId) as string[]

  // get all the person's ids 
  let dataEmbeds = [] as any[]
  for (let i = 0; i < participantsIDs.length; i++) {
    let retData = await getUserMetadata(db, participantsIDs[i])
    console.log(retData)
    dataEmbeds.push(retData.embedding[0])
  }

  let clusters = kmeans(dataEmbeds, numberOfGroups, {} ).clusters
  let clusterResult: {[id: string]: number} = {}

  for (let i = 0; i < participantsIDs.length; i++) {
    clusterResult[participantsIDs[i]] = clusters[i]
  }

  update(child(ref(db, "parties"), partyId), {
    clusterResult: clusterResult
  })

}