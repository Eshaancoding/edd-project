<script lang="ts">
    import {signInUser } from "$lib/API/users"    
    import { auth } from "$lib/firebase"
    import { goto } from '$app/navigation';

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
            case 'auth/invalid-credential':
                error = "Wrong password!"
                break;
            case 'unknown':
                error = "An unknown error occured"
                break;
            default:
                goto("/parties")
        }
    }
</script>

<h1 class="w-full text-center py-4 font-bold text-[22px]">Log In Page</h1>

<form on:submit={loginClick}>
    <div class="flex flex-col gap-2 relative mx-auto max-w-96">
        <input
            bind:value={email}
            name="Email"
            placeholder="Email"
            required
        />
        <input
            bind:value={password}
            name="Password"
            type="password"
            placeholder="Password"
            required
        />
    
        {#if error.length > 0}
            <p class="text-red-500">{error}</p>
        {/if}

        <button type="submit">Log in</button>
    </div>
    
</form>