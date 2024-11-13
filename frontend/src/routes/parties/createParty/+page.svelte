<script lang="ts">
    import { goto } from "$app/navigation";
    import { createParty, onPartiesList } from "$lib/API/parties"    
    import {db, auth} from "$lib/firebase"

    let name_party = $state("")
    let desc_party = $state("")
    let location = $state("")


    $effect(() => {
        if (auth.currentUser == null) goto("/")
    })

    function cParty () {
        createParty(db, name_party, desc_party, location, auth.currentUser!.uid)
        goto("/parties")
    }

</script>

<h1 class="w-full text-center py-4 font-bold text-[22px]">Parties</h1>

<div class="flex flex-col gap-2 relative mx-4 my-4 ">
    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Name of Party:
        <input bind:value={name_party} type="text" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>

    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Description of Party:
        <input bind:value={desc_party} type="text" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>

    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Location: 
        <input bind:value={location} type="text" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>
</div>

<button 
    on:click={cParty}
    class="relative mt-8 ml-4 w-[150px] text-center px-4 py-2 bg-blue-500 rounded-[15px] text-white"
>
    Create Party
</button>