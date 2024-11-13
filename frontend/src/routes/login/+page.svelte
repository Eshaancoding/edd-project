<script>
    import { goto } from "$app/navigation";
    import {signInUser } from "$lib/API/users"    
    import {db, auth} from "$lib/firebase"
    import { redirect } from "@sveltejs/kit";

    let email = ""
    let password = ""
    let error = ""
    
    async function loginClick () {
        let result = await signInUser(auth, email, password) 
        
        switch (result) {
            case 'auth/invalid-email':
                error = "Invalid email!"
                break;
            case 'auth/user-disabled':
                error = "User disabled!"
                break;
            case 'auth/user-not-found':
                error = "User not found!"
                break;
            case 'auth/wrong-password':
                error = "Wrong password!"
                break;
            case 'auth/too-many-requests':
                error = "Too many requests!"
                break;
            case 'auth/network-request-failed':
                error = "Network request failed!"
                break;
            default:
                goto("/parties") // it's a success
        }
    }
</script>

<h1 class="w-full text-center py-4 font-bold text-[22px]">Log In Page</h1>

<div class="flex flex-col gap-2 relative mx-4 ">
    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Email:
        <input bind:value={email} type="text" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>

    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Password:
        <input bind:value={password} type="password" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>

    {#if error.length > 0}
        <p class="text-red-500">{error}</p>
    {/if}
</div>

<button 
    on:click={loginClick}
    class="relative left-[50%] -translate-x-[50%] w-[100px] text-center px-4 py-2 bg-blue-500 rounded-[15px] text-white"
>
    Log in
</button>