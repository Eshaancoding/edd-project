<script lang="ts">
    import {signInUser } from "$lib/API/users"    
    import { auth } from "$lib/firebase"
    import { goto } from '$app/navigation';
    import {setPersistence, browserLocalPersistence} from 'firebase/auth'

    let email = ""
    let password = ""
    let error = ""
    
    async function loginClick () {
        let result;
        // https://firebase.google.com/docs/auth/web/auth-state-persistence
        setPersistence(auth, browserLocalPersistence)
            .then(async () => {
                result = await signInUser(auth, email, password);
                // console.log(result)
                // console.log(auth.currentUser)
                goto("/parties")
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
            });
        
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

<div class="bg-orange-50 min-h-screen pt-[200px]">
    <div class="px-6">
        <h1 class="w-full text-center py-4 font-bold text-[22px]">Log In</h1>
        
        <form on:submit={loginClick}>
            <div class="flex flex-col gap-3 relative mx-auto max-w-96">
                <div class="form-group">
                    <input bind:value={email} type="text" class="outlined w-full" required>
                    <label>Email</label>
                </div>
                <div class="form-group">
                    <input bind:value={password} type="password" class="outlined" required>
                    <label>Password</label>
                </div>
        
                {#if error.length > 0}
                    <p class="text-red-500">{error}</p>
                {/if}
        
                <button type="submit" class="bg-black hover:bg-gray-700 transition-colors text-white rounded-lg px-3 py-2">Log in</button>
            </div>
        
        </form>
    </div>
</div>