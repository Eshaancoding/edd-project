<script>
    import { goto } from "$app/navigation";
    import {signInUser, signUpUser} from "$lib/API/users"    
    import {db, auth} from "$lib/firebase"
    import { redirect } from "@sveltejs/kit";

    let email = ""
    let password = ""
    
    async function loginClick () {
        await signInUser(auth, email, password) 
        goto("/parties")
    }
</script>

<h1 class="w-full text-center py-4 font-bold text-[22px]">Sign Up Page</h1>

<div class="flex flex-col gap-2 relative mx-4 ">
    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Email:
        <input bind:value={email} type="text" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>

    <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
        Password:
        <input bind:value={password} type="password" class="border-1 rounded-[10px] border-black px-2 py-1" />
    </div>
</div>

<button 
    on:click={loginClick}
    class="relative left-[50%] -translate-x-[50%] w-[100px] text-center px-4 py-2 bg-blue-500 rounded-[15px] text-white"
>
    Log in
</button>