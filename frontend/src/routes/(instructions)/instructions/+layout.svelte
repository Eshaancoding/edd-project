<!-- Layout in routes/(default)/+layout.svelte -->

<script lang="ts">
    import { onMount } from "svelte";
	import { db, auth } from "$lib/firebase";
    import { signOut, onAuthStateChanged } from "firebase/auth";

    let loggedIn: boolean = false;

    onMount(() => {
        onAuthStateChanged(auth, (user) => {
            // console.log(user)
            if (user !== null) {
                loggedIn = true;
            }
        });
    });

    function signOutLink() {
        signOut(auth).then(() => {
            
        }).catch((error) => {
            // An error happened.
        });
    }

    let y:number;
</script>

<style>
    nav {
        backdrop-filter: blur(40px);
    }

    .nav-links > a:not(.bg-white) {
        @apply hover:text-white transition-colors;
    }
</style>

<svelte:window bind:scrollY={y} />

<nav class="fixed w-full py-3 z-10 transition-colors {y > 0 ? "bg-black/70" : "transparent"}">
    <div class="w-full container flex flex-row justify-between">
        {#if !loggedIn}
            <a class="text-2xl font-bold text-white" href="/">IntroTag</a>
        {:else}
            <a class="text-lg font-medium text-white flex flex-row items-center gap-2" href="/parties">
                <svg class="mt-[1px]" width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                Back to Dashboard
            </a>
        {/if}
        <div class="nav-links flex flex-row gap-4 items-center text-white/50">
            {#if !loggedIn}
                <a href="/instructions" class="">Instructions</a>
                <a href="/login" class="">Log In</a>
                <a href="/signup" class="bg-white hover:bg-gray-400 transition-colors text-black rounded-lg px-3 py-2">Sign Up</a>
            {:else}
                <button on:click={signOutLink}>Sign Out</button>
            {/if}
        </div>
    </div>
</nav>

<!-- {@render children()} -->
<slot />