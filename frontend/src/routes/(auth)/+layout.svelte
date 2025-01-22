<!-- Layout of login and signup -->

<script lang="ts">
	// let { children } = $props();
</script>

<style>
    .nav-links > a:not(.bg-white) {
        @apply text-white/70 hover:text-white transition-colors;
    }
</style>

<nav class="fixed w-full py-3 z-10 bg-black">
    <div class="w-full container flex flex-row justify-between">
        <a class="text-2xl font-bold text-white align-middle content-center" href="/">IntroTag</a>
        <div class="nav-links flex flex-row gap-4 items-center text-white/50">
            <a href="/login" class="">Log In</a>
            <a href="/signup" class="bg-white hover:bg-gray-400 transition-colors text-black rounded-lg px-3 py-2">Sign Up</a>
        </div>
    </div>
</nav>

<!-- {@render children()} -->
<slot />