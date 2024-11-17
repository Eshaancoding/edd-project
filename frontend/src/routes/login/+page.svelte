<script>
    import {Button, TextFieldOutlined} from 'm3-svelte';
    import { goto } from "$app/navigation";
    import {signInUser, signUpUser} from "$lib/API/users"    
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

<form on:submit={loginClick}>
    <div class="flex flex-col gap-2 relative mx-auto max-w-96">
        <TextFieldOutlined
            bind:value={email}
            name="Email"
            required
        />
        <TextFieldOutlined
            bind:value={password}
            name="Password"
            extraOptions={{type: "password"}}
            required
        />
    
        {#if error.length > 0}
            <p class="text-red-500">{error}</p>
        {/if}

        <Button
            type="filled"
            extraOptions={{type: "submit"}}
        >
            Log in
        </Button>
    </div>
    
</form>