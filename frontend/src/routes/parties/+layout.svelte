<!-- Layout for viewing all parties -->
<script lang="ts">
    import { onMount } from "svelte";
	import { auth } from "$lib/firebase";
    import { goto } from "$app/navigation";
	import { signOut, onAuthStateChanged } from "firebase/auth";
    
    function signOutLink() {
        signOut(auth).then(() => {
            
        }).catch((error) => {
            // An error happened.
        });
    }

    onMount(() => {
		onAuthStateChanged(auth, (user) => {
            // console.log(user)
			if (user === null) goto("/login");
			else {

			}
		});
	});
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
            <a href="/instructions" class="">Instructions</a>
            <button on:click={signOutLink}>Sign Out</button>
        </div>
    </div>
</nav>

<!-- {@render children()} -->
<slot />