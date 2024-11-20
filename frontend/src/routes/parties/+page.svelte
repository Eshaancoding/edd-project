<script lang="ts">
    import { goto } from "$app/navigation";
    import { joinParty, onPartiesList, leaveParty } from "$lib/API/parties"    
    import { getUserMetadata } from "$lib/API/users";
    import { db, auth } from "$lib/firebase"
    import { grouping_algo } from "$lib/groupingAlgorithm"

    let d = [] as any[]
    let partiesJoined = [] as string[]
    let name = "" 
    
    $: {
        if (auth.currentUser == null) goto("/")
        else {
            getUserMetadata(db, auth.currentUser!.uid).then((value:any) => name = value.name)

            onPartiesList(db, (data:any) => {
                d = data
                partiesJoined = []
                Object.keys(data).forEach((partyId:string) => {
                    data[partyId].participants.forEach((element:any) => {
                        if (element.profileId == auth.currentUser!.uid) {
                            partiesJoined.push(partyId) 
                        }
                    });
                }); 

            })
        }
    }

    async function joinP (partyId:string) {
        let metadata = await getUserMetadata(db, auth.currentUser!.uid)
        
        await joinParty(
            db,
            metadata.name,
            auth.currentUser!.uid,
            partyId
        )

        grouping_algo(db, partyId)
    }

    async function leaveP (partyId:string) {
        await leaveParty(db, partyId, auth.currentUser!.uid); 
        grouping_algo(db, partyId)
    }
</script>

<h1 class="w-full text-center py-4 text-[22px]">
    <span class="font-bold">Hello {name}!</span> 
    <br /> 
    Join a party
</h1>

<div class="my-8">
    <a 
        href="/parties/createParty"
        class="relative relative top-4 ml-4 w-[100px] text-center px-4 py-2 bg-blue-500 rounded-[15px] text-white"
    >
        Create Party
    </a>
</div>

<div class="m-4">
    {#each Object.values(d) as value}
        <div 
            class="p-2 w-full border-2 border-slate-400 my-4 rounded-[15px] w-full"
        >
            <div class="flex">
                Name: {value.name}
            </div>
            <div class="flex">
                Description: {value.description}
            </div>
            <div class="flex">
                Location: {value.location}
            </div>

            <br />
            <div class="flex my-4 flex-col gap-2">
                Partipants 

                {#each value.participants as any[] as part}
                    <a href={"/profile/" + part.profileId}>
                        <div class="p-2 w-full border-2 border-slate-100 rounded-[15px] w-full">
                            {part.name}
                        </div> 
                    </a>
                {/each}
            </div>

            <div class="my-2">
                {#if partiesJoined.includes(value.partyId) } 
                    <a 
                        href={"/parties/" + value.partyId}
                        class="relative relative w-[100px] text-center px-4 py-2 bg-blue-500 rounded-[15px] text-white"
                    >
                        Go to Party
                    </a>
                    <button 
                        on:click={() => leaveP(value.partyId)}
                        class="relative relative w-[150px] text-center px-4 py-2 bg-blue-500 rounded-[15px] text-white"
                    >
                        Leave Party
                    </button>
                {:else}
                    <button 
                        on:click={() => joinP(value.partyId)}
                        class="relative relative w-[100px] text-center px-4 py-2 bg-blue-500 rounded-[15px] text-white"
                    >
                        Join Party
                    </button>
                {/if}
            </div>
        </div> 
    {/each}
</div>



