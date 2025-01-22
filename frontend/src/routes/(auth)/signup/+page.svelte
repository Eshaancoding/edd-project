<!-- Sign up page -->

<script lang="ts">
    import { goto } from "$app/navigation";
    import {signUpUser} from "$lib/API/users"    
    import {db, auth} from "$lib/firebase"

    let signingUpStatus = ""
    
    let name = ""
    let email = ""
    let phone = ""
    let password = ""
    let interests = [] as string[]
    let bio = ""
    
    async function signUpClick () {
        await signUpUser(db, auth, name, email, phone, password, bio, interests, (status:string) => { signingUpStatus = status })
        goto("/parties")
    }
</script>

<style>
    /* https://unsplash.com/photos/brown-soil-pathway-between-green-leaf-trees-in-aerial-photography-during-daytime-m3oLLB7w3Xg */
    .bg-clouds {
        background-image: url("$lib/images/forest.jpg");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }
</style>

<div class="flex bg-orange-50 min-h-screen pt-[200px] pb-8">
    <div class="p-5 basis-2/5">
        <div class="bg-clouds h-full rounded-3xl p-14 flex flex-col justify-between">
            <div class="text-5xl font-light text-white text-right leading-tight">Make the first step to break out of your comfort zone!</div>
        </div>
    </div>

    <div class="basis-3/5 px-5 pt-20">
        <form class="flex flex-col gap-2 max-w-[400px] mx-auto" on:submit={signUpClick}>
            <h1 class="text-5xl font-bold mb-4">Sign up</h1>
            <div class="form-group">
                <input type="text" class="outlined w-full" bind:value={email} required>
                <label>Email</label>
            </div>
            <div class="form-group">
                <input type="password" class="outlined" bind:value={password} required>
                <label>Password</label>
            </div>
            <div class="form-group">
                <input type="text" class="outlined w-full" bind:value={name} required>
                <label>Name</label>
            </div>
            <div class="form-group">
                <textarea class="outlined" rows="3" bind:value={bio} required></textarea>
                <label>Bio</label>
            </div>
            {#each {length: 5} as _, i}
                <div class="form-group">
                    <input type="text" class="outlined" bind:value={interests[i]} required>
                    <label>Interest {i+1}</label>
                </div>
            {/each}
        
            <button type="submit" class="bg-black hover:bg-gray-700 transition-colors text-white rounded-lg px-3 py-2">Sign up</button>
        </form>
    </div>
</div>
<!-- 
{#if signingUpStatus.length > 0}
    <div 
        class="relative left-[50%] -translate-x-[50%] px-4 text-center px-4 py-2 bg-slate-400 rounded-[15px] text-slate-600"
    >
        {signingUpStatus}
    </div>

{:else}
    <button 
        on:click={signUpClick}
        class="relative left-[50%] -translate-x-[50%] w-[100px] text-center px-4 py-2 bg-blue-500 rounded-[15px] text-white"
    >
        Sign up
    </button>
{/if} -->