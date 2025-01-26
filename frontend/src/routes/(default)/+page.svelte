<script lang="ts">
    import productImage from "$lib/images/product-shot.jpg"
</script>

<style>
    .hero img {
        height: 400px;
    }
</style>

<div class="hero pt-[64px] bg-green-950">
    <div class="container py-24">
        <div class="flex flex-col lg:flex-row items-center">
            <div class="lg:basis-5/12 text-center lg:text-left">
                <h1 class="font-serif text-7xl font-light text-yellow-100 mb-4">Break out of your comfort zone.</h1>
                <p class="text-base text-white/50 w-1/2 lg:w-3/4 mb-8 mx-auto lg:mx-0">IntroTag helps anyone make a lasting first impression, jump-starting long-lasting friendships.</p>
                <a href="/signup" class="bg-white text-black rounded-lg px-3 py-2">Sign Up</a>
                <a href="/instructions" class="text-white/50 hover:text-white transition-colors ml-2 px-3 py-2">Instructions</a>
            </div>
            <div class="lg:basis-7/12 flex justify-center">
                <img class="rounded-3xl" src={productImage} alt="Product hanging from a lanyard on a person's chest"/>
            </div>
        </div>
        <div></div>
    </div>
</div>