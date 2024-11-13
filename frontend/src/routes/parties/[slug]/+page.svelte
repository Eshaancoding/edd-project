<script lang="ts">
    import { page } from "$app/stores";
    import { auth, db } from "$lib/firebase";
    import { getParty } from "$lib/API/parties"    
    import { goto } from "$app/navigation";
    import { getUserMetadata } from "$lib/API/users";
    import { cosineSimilarity } from "$lib/helper"
    import { 
        onAvailableDevices, 
        registerDevice, 
        unregisterDevice,
        updateDisplayName
    } from "$lib/API/devices"

    let partyId = $page.params.slug
    let partyInfo = $state({} as any)
    let userMetaData = $state({} as any)
    let availableDevices = $state([] as any[])
    let connectedDevice = $state("")
    let sortedPartipants = $state([] as any[])
    
    $effect(() => {
        async function getInfo () { 
            // get party information and user meta data
            let pi = await getParty(db, partyId) 
            console.log(pi)
            let metadata = {} as any
            for (let i = 0; i < pi.participants.length; i++) {
                let data = await getUserMetadata(db, pi.participants[i].profileId)
                metadata[pi.participants[i].profileId] = data
            }
            sortedPartipants = sortPartipants(pi.participants, metadata)

            // update available devices
            onAvailableDevices(db, auth.currentUser!.uid, partyId, (data: any, isConnected:boolean) => {
                console.log(isConnected)
                if (isConnected) {
                    connectedDevice = data
                }
                else {
                    availableDevices = data
                }
            }) 

            userMetaData = metadata
            partyInfo = pi
        }
        
        if (auth.currentUser == null) goto("/")
        else if (Object.keys(partyInfo).length == 0 && Object.keys(userMetaData).length == 0) {
            getInfo()
        }
    })


    function sortPartipants (arr:any[], metadata:any) {
        let res = [] as any[]

        if (metadata == null || Object.keys(metadata).length == 0) return []
        if (arr == null || Object.keys(arr).length == 0) return []

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


        let sortedData = res.sort((a, b) => b.similarity - a.similarity)

        if (connectedDevice.length > 0) { // connected to device
            updateDisplayName(
                db,
                connectedDevice,
                sortedData[0].name
            )
        }

        return sortedData

    }

    $effect(() => console.log(connectedDevice))

</script>

{#if Object.keys(partyInfo).length > 0}
    <div class="flex flex-col">
        <p>{partyInfo.name}</p>
        <p>{partyInfo.description}</p> 
        <p>At: {partyInfo.location}</p> <br />
        
        <div class="p-4 rounded-[15px] bg-slate-100 m-4">
            {#if connectedDevice.length > 0}
                <div class="flex flex-row justify-between">
                    <p class="py-2"><span class="font-bold">Connected Device: </span> {connectedDevice}</p>
                    <button
                        onclick={() => {unregisterDevice(db, connectedDevice); connectedDevice = ""}} 
                        class="bg-blue-500 p-2 px-4 text-white rounded-[15px]"
                    >
                        Disconnect
                    </button> 
                </div>
            {:else}
                <p class="font-bold py-2">Register Device</p>
                <div class="flex flex-col gap-4">
                    {#each Object.keys(availableDevices) as device}
                        <div class="flex flex-row bg-slate-200 items-center w-full p-2 rounded-[15px] justify-between">
                            <p class="mx-2">{device}</p>
                            <button 
                                onclick={() => registerDevice(
                                    db, 
                                    userMetaData[auth.currentUser!.uid]["name"],
                                    sortedPartipants[0].name,
                                    auth.currentUser!.uid, 
                                    partyId, 
                                    device
                                )}
                                class="bg-blue-500 p-2 px-4 text-white rounded-[15px]"
                            >Register</button>
                        </div>
                    {/each} 
                </div>
            {/if}
        </div>
        <br />

        <p>You should meet (most similar): </p>
        {#each sortedPartipants as partipant}
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