<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { getUserMetadata } from "$lib/API/users.js";
    import { auth, db } from "$lib/firebase.js";

    let email = $state("")
    let name = $state("")
    let interests = $state([] as string[])
    let phone = $state("")
    let bio = $state("")

    $effect(() => { // load meta data
        async function start () {
            let data = await getUserMetadata(db, $page.params.slug)
            
            phone = data.phone
            name = data.name
            email = data.email 
            interests = data.interests
            bio = data.bio
        }
        if (auth.currentUser == null) goto("/")
        else if (email.length == 0) {
            start()
        }
    })

</script>

<div class="p-4">
    {#if name == ""} 
        <div>Loading...</div>
    {:else}
        <div class="text-[24px] my-4">{name}</div>
        <div><span class="font-bold">Phone:</span> {phone}</div>
        <div><span class="font-bold">Email:</span> {email}</div>
        <p><span class="font-bold">Bio:</span> {bio}</p>
        
        <br />
        {#each interests as interest, i}
            <div>Interest #{i+1}: {interest}</div>
        {/each}
        <br />
    {/if}

    {#if (auth.currentUser?.uid != $page.params.slug)}
        <a 
            href={"/chat/" + $page.params.slug}
            class="relative relative ml-4 w-[150px] text-center px-4 py-2 bg-blue-500 rounded-[15px] text-white"
        >
            Chat
        </a>
    {:else}
        <button 
            onclick={() => {}}
            class="relative relative ml-4 w-[150px] text-center px-4 py-2 bg-blue-500 rounded-[15px] text-white"
        >
            Edit Profile
        </button>
    {/if}

</div>