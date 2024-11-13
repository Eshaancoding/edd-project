<script lang="ts">
    import { page } from "$app/stores";
    import { auth, db } from "$lib/firebase";
    import { getParty } from "$lib/API/parties"    
    import { goto } from "$app/navigation";
    import { getUserMetadata } from "$lib/API/users";
    import { cosineSimilarity } from "$lib/helper"

    let partyId = $page.params.slug
    let partyInfo = $state({} as any)
    let userMetaData = $state({} as any)
    
    $effect(() => {
        async function getPartyInfo () { 
            console.log('geting party info')
            partyInfo = await getParty(db, partyId) 

            userMetaData = {}
            for (let i = 0; i < partyInfo.participants.length; i++) {
                userMetaData[partyInfo.participants[i].profileId] = await getUserMetadata(db, partyInfo.participants[i].profileId)
            }
            
            console.log("======== User metadata ========")
            console.log(userMetaData)
            console.log("=============================")
        }
        
        if (auth.currentUser == null) goto("/")
        else if (Object.keys(partyInfo).length == 0 && Object.keys(userMetaData).length == 0) {
            getPartyInfo()
        }
    })

    function sortPartipants (arr:any[], metadata:any) {
        let res = [] as any[]

        if (Object.keys(metadata).length == 0) return []
        if (Object.keys(arr).length == 0) return []

        arr.forEach((partipant:any) => {
            if (partipant.profileId != auth.currentUser!.uid) {
                res.push({
                    "name": partipant.name,
                    "profileId": partipant.profileId,
                    "similarity": cosineSimilarity(
                        metadata[partipant.profileId]["embedding"][0],
                        metadata[auth.currentUser!.uid]["embedding"][0],
                    )
                }) 
            }
        });

        console.log(res)

        return res.sort((a, b) => b.similarity - a.similarity)
    }

    
</script>

{#if Object.keys(partyInfo).length > 0}
    <div class="flex flex-col">
        <p>{partyInfo.name}</p>
        <p>{partyInfo.description}</p> 
        <p>At: {partyInfo.location}</p> <br />
        <p>You should meet (most similar): </p>
        {#each sortPartipants(partyInfo.participants, userMetaData) as partipant}
            <div class="p-4 rounded-[15px] bg-slate-100 m-4">
                <p class="font-bold py-2">{partipant.name} ({Math.round(partipant.similarity*100)}% similarity)</p>
                <div class="flex flex-row gap-4">
                    <div>
                        <p>Interests:</p>
                        {#each userMetaData[partipant.profileId].interests as interest}
                            <p class="mx-4">{interest}</p>
                        {/each}
                    </div>
                    <div>
                        <p>Your Interests:</p>
                        {#each userMetaData[auth.currentUser!.uid].interests as interest}
                            <p class="mx-4">{interest}</p>
                        {/each}
                    </div>
                </div>
            </div>
        {/each}
    </div>

        
{/if}