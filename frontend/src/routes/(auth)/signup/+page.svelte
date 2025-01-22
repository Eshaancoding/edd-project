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
    let interestOne = ""
    let interestTwo = ""
    let interestThree = ""
    let interestFour = ""
    let interestFive = ""
    let bio = ""
    
    async function signUpClick () {
        await signUpUser(db, auth, name, email, phone, password, bio, [
            interestOne,
            interestTwo,
            interestThree,
            interestFour,
            interestFive
        ], (status:string) => { signingUpStatus = status })
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

<div class="flex min-h-screen">
    <div class="p-5 basis-2/5">
        <div class="bg-clouds h-full rounded-3xl p-14 flex flex-col justify-between">
            <div><a class="text-3xl font-bold text-white" href="/">LOGO</a></div>
            <div class="text-5xl font-light text-white text-right leading-tight">Ask Hillel out for a date right now. This is a once in a lifetime opportunity!</div>
        </div>
    </div>

    <div class="basis-3/5 px-5 pt-20">
        <div class="flex flex-col gap-2 max-w-[400px] mx-auto">
            <h1 class="text-5xl font-bold mb-4">Sign up</h1>
            <div class="form-group">
                <input type="text" class="outlined w-full" required>
                <label>Email</label>
            </div>
            <div class="form-group">
                <input type="password" class="outlined" required>
                <label>Password</label>
            </div>
            <div class="form-group">
                <input type="password" class="outlined" required>
                <label>Confirm password</label>
            </div>
            <div class="flex gap-2">
                <div class="form-group">
                    <input type="text" class="outlined" required>
                    <label>First name</label>
                </div>
                <div class="form-group">
                    <input type="text" class="outlined" required>
                    <label>Last name</label>
                </div>
            </div>
            <div class="flex gap-2 items-center border-2 w-[350px] border-slate-200 rounded-[10px] px-2 py-1">
                Bio:
                <textarea bind:value={bio} class="w-[300px] h-[100px] border-1 rounded-[10px] border-black px-2 py-1"></textarea>
            </div>
        
            <button class="color">Sign Up</button>
        </div>
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