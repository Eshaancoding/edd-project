<script lang="ts">
    import { goto } from "$app/navigation";
    import { joinParty, onPartiesList } from "$lib/API/parties"    
    import { getUserMetadata } from "$lib/API/users";
    import {db, auth} from "$lib/firebase"
    import type { Database } from "firebase/database";

    let d = [] as any[]
    
    $: onPartiesList(db, (data:any) => {
        console.log(data)
        d = data
    })

    // some error with svelte, wanna check later
    // $: if (auth.currentUser == null) goto("/login") // if no current user, go back to login

    async function joinP (partyId:string) {
        let metadata = await getUserMetadata(db, auth.currentUser!.uid)

        await joinParty(
            db,
            metadata.name,
            auth.currentUser!.uid,
            partyId
        )
    }
</script>

<h1 class="w-full text-center py-4 font-bold text-[22px]">Parties</h1>

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

            <button 
                on:click={() => joinP(value.partyId)}
                class="relative relative ml-4 w-[100px] text-center px-4 py-2 bg-blue-500 rounded-[15px] text-white"
            >
                Join Party
            </button>
        </div> 
    {/each}
</div>

<a 
    href="/parties/createParty"
    class="relative relative top-4 ml-4 w-[100px] text-center px-4 py-2 bg-blue-500 rounded-[15px] text-white"
>
    Create Party
</a>

