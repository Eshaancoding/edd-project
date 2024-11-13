<script lang="ts">
    import { goto } from "$app/navigation";
    import {signUpUser} from "$lib/API/users"    
    import {db, auth} from "$lib/firebase"
    import { redirect } from "@sveltejs/kit";

    let signingUpStatus = ""
    
    let name = ""
    let email = ""
    let phone = ""
    let password = ""
    let interestOne = ""
    let interestTwo = ""
    let interestThree = ""
    let interestFour = ""
    let interestFive = ""
    
    async function signUpClick () {
        await signUpUser(db, auth, name, email, phone, password, [
            interestOne,
            interestTwo,
            interestThree,
            interestFour,
            interestFive
        ], (status:string) => { signingUpStatus = status })
        goto("/parties")
    }
</script>

<h1 class="w-full text-center py-4 font-bold text-[22px]">Sign Up Page</h1>

<div class="flex flex-col gap-2 relative mx-4 ">
    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Name:
        <input bind:value={name} type="text" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>

    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Email:
        <input bind:value={email} type="text" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>

    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Phone:
        <input bind:value={phone} type="text" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>

    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Password:
        <input bind:value={password} type="password" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>

    <br /> <br />

    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Interests 1:
        <input bind:value={interestOne} type="text" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>

    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Interests 2:
        <input bind:value={interestTwo} type="text" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>

    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Interests 3:
        <input bind:value={interestThree} type="text" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>

    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Interests 4:
        <input bind:value={interestFour} type="text" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>

    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Interests 5:
        <input bind:value={interestFive} type="text" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>
</div>

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
{/if}