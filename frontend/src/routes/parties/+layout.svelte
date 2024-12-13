<script lang="ts">
	// let { children } = $props();
    import { signOut } from "firebase/auth";
    import { auth } from "$lib/firebase"
    
    function signOutLink() {
        signOut(auth).then(() => {
            
        }).catch((error) => {
            // An error happened.
        });
    }
</script>

<style>
    .nav-links > a, .nav-links > button {
        @apply text-white/70 hover:text-white transition-colors;
    }
</style>

<nav class="fixed w-full py-3 z-10 bg-black">
    <div class="w-full container flex flex-row justify-between">
        <a class="text-2xl font-bold text-white align-middle content-center" href="/parties">IntroTag</a>
        <div class="nav-links flex flex-row gap-4 items-center text-white/70">
            <button on:click={signOutLink}>Sign Out</button>
        </div>
    </div>
</nav>

<!-- {@render children()} -->
<slot />