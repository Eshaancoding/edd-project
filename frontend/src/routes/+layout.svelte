<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>


<nav class="fixed w-full py-4 bg-white z-10">
    <div class="w-full max-w-[800px] px-6 mx-auto flex flex-row justify-between">
        <div class="text-2xl font-bold">IntroTag</div>
        <div class="flex flex-row gap-2">
            <a href="/login">Log In</a>
            <a href="/signup">Sign Up</a>
        </div>
    </div>
</nav>
{@render children()}
