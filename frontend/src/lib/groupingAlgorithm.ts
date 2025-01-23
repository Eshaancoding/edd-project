// groupingAlgorithm.ts

import { kmeans } from "ml-kmeans"
import { getParty } from "./API/parties"
import { getUserMetadata } from "./API/users"
import { child, ref, update, Database } from "firebase/database"
import { cosineSimilarity } from "./helper"

const numberOfGroups = 2 // this could be custom

// Given the party id, will get the list of participants and sort them into groups accordant to their similarity score (similar interests --> same groups)

export function mag (vec:number[]) {
  let val = 0
  for (let i = 0; i < vec.length; i++) {
    val += vec[i] * vec[i];
  } 
  return Math.sqrt(val)
}

export async function grouping_algo (db: Database, partyId:string) {
  let partyData = await getParty(db, partyId) as any

  // get list of partipants ids
  let participantsIDs = partyData.participants.map((value:any) => value.profileId) as string[]

  if (participantsIDs.length <= numberOfGroups) {
    // don't do any calculations when the number of partipants has no number of groups
    update(child(ref(db, "parties"), partyId), {
      clusterResult: {}
    })
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

  // Determine get whether one person is alone
  // idone --> 0
  // idtwo --> 1
  // idthree --> 1

  Object.entries(clusterCount)
    .filter((value: [string, number]) => { 
      return value[1] == 1 
    })
    .forEach((value: [string, number]) => {
      const clusterId = parseInt(value[0])

      let partID = Object.entries(clusterResult).filter((value) => value[1] == clusterId)[0][0]
      let partipantIdx = participantsIDs.indexOf(partID)
      let partipantDataEmbds = dataEmbeds[partipantIdx]
    
      let highest_similarity = 0      
      let closestIdx = -1

      // Find alone paritipant that has the closest cosine similarity score (compatability with group) 
      for (let i = 0; i < participantsIDs.length; i++) {
        if (i != partipantIdx) {
          let potentialDataEmbeds = dataEmbeds[i]
          let pot_similarity = cosineSimilarity(potentialDataEmbeds, partipantDataEmbds)

          if (pot_similarity > highest_similarity) {
            highest_similarity = pot_similarity
            closestIdx = i
          }
        }
      }

      let joinedCluster = clusterResult[participantsIDs[closestIdx]]

      if (participantsIDs.length == 3) {
        clusterResult[partID] = joinedCluster  // put it all in one
      } else {
        clusterResult[participantsIDs[closestIdx]] = clusterId // pull one person from one other group to make 2 v 2 etc.
      }
    })

  // Update firebase
  update(child(ref(db, "parties"), partyId), {
    clusterResult: clusterResult
  })

}