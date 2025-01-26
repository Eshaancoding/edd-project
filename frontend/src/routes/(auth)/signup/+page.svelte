<!-- Sign up page -->

<script lang="ts">
    import { goto } from "$app/navigation";
    import {signUpUser} from "$lib/API/users"    
    import {db, auth} from "$lib/firebase"

    let signingUpStatus = ""
    let error = ""
    
    let name = ""
    let email = ""
    let phone = ""
    let password = ""
    let interests = [] as string[]
    let bio = ""
    
    async function signUpClick (e) {
        e.preventDefault();
        let result = await signUpUser(db, auth, name, email, phone, password, bio, interests, (status:string) => { signingUpStatus = status })
        switch (result) {
            case 'auth/invalid-email':
                error = "Invalid email!"
                break;
            case 'auth/too-many-requests':
                error = "Too many requests!"
                break;
            case 'auth/network-request-failed':
                error = "Network request failed!"
                break;
            case 'auth/email-already-in-use':
                error = "Email already in use!"
                break;
            case 'auth/weak-password':
                error = "Password must be at least 6 characters!"
                break;
            case 'unknown':
                error = "An unknown error occured"
                break;
            default:
                goto("/parties")
        }
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

<div class="bg-orange-50 min-h-screen pt-[100px] pb-8">
    <div class="container flex justify-center">
        <div class="w-full lg:basis-1/2">
            <form class="flex flex-col gap-2 max-w-[400px] mx-auto lg:mx-0" on:submit={signUpClick}>
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

                {#if error.length > 0}
                    <p class="text-red-500 text-sm mb-1">{error}</p>
                {/if}
                
                {#if signingUpStatus.length > 0}
                    <div 
                        class="px-3 py-2 rounded-lg text-center px-4 py-2 bg-gray-400 text-gray-700"
                    >
                        {signingUpStatus}
                    </div>

                {:else}
                    <button type="submit" class="bg-black hover:bg-gray-700 transition-colors text-white rounded-lg px-3 py-2">Sign up</button>
                {/if}
            </form>
        </div>
        <div class="hidden lg:block lg:basis-1/2">
            <div class="bg-clouds h-full rounded-3xl p-7 lg:p-12 flex flex-col-reverse justify-between">
                <div class="text-4xl lg:text-5xl font-light text-white text-left leading-tight">Make the first step to break out of your comfort zone!</div>
            </div>
        </div>
    </div>
</div>
