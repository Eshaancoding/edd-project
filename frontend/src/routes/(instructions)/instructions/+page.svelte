<script lang="ts">
    import One from "$lib/images/instructions/one.png"
    import Two from "$lib/images/instructions/two.png"
    import Three from "$lib/images/instructions/three.png"
    import Four from "$lib/images/instructions/four.png"
    import Five from "$lib/images/instructions/five.png"
    import Six from "$lib/images/instructions/six.png"
    import Seven from "$lib/images/instructions/seven.png"
    import Eight from "$lib/images/instructions/eight.png"
    import Nine from "$lib/images/instructions/nine.png"
    import Ten from "$lib/images/instructions/ten.png"
    import Eleven from "$lib/images/instructions/eleven.png"
    import Twelve from "$lib/images/instructions/twelve.png"

    import After from "$lib/images/instructions/after.png"
    import Before from "$lib/images/instructions/before.png"

</script>

<style>
    .hero img {
        height: 400px;
    }

    a {
        @apply text-white hover:text-white/70 transition-colors underline decoration-[1px];
    }

    img {
        @apply border-yellow-50/50 border max-w-[600px];
    }

    .deviceImages img {
        max-width: 300px;
    }

    p {
        margin-top: 1rem;
    }
</style>

<div class="bg-green-950 pb-20">
    <div class="hero pt-[64px]">
        <div class="container py-24">
            <div class="flex flex-col lg:flex-row items-center">
                <div class="lg:basis-1/2 text-center lg:text-left">
                    <h1 class="font-serif text-7xl font-light text-yellow-100 mb-4">Instructions.</h1>
                    <p class="text-base text-white/50 w-1/2 lg:w-3/4 mb-6 mx-auto lg:mx-0">Make sure you have already set up your device first by following the instructions that were given in the product box.</p>
                </div>
            </div>
            <div></div>
        </div>
    </div>
    <div class="container text-white w-full flex gap-3 flex-col ">
        <p>1. Navigate to <a href="https://edd-black.vercel.app">https://edd-black.vercel.app</a> </p>
        <img src={One} alt="One" />
        <p>2. Click the "Log In" or "Sign Up" button in the upper right corner.</p>
        <img src={Two} class="w-[400px]" alt="Two" />
        <p>3. After logging in or signing up and making a profile with your credentials, you will see your dashboard.</p>
        <img src={Three} alt="Three" />
        <p>4. Locate a party that you would like to join and click the “Join Party” button. Your name should pop up under the party.</p>
        <img src={Four} class="w-[400px]" alt="Four" />
        <p>5. Click the “Go to Party” button and the party details will pop up.</p>
        <img src={Five} alt="Five" />
        <p>6. You can register a device now. Look at your device and read the Device ID. On the website, click “Register” to connect your profile with the device. After registering, your name and a colored shape should show up on the device. If you see your colored shape on another person’s name tag, it means they have similar interests to you!</p>
        <img src={Six} alt="Six" />
        <div class="deviceImages">
            <div class="inline-flex flex-col">
                <img src={Before} alt="before" />
                <p class="w-full text-white/50 text-center py-1 text-sm">Before Registration</p>
            </div>
    
            <div class="inline-flex flex-col">
                <img src={After} alt="After" />
                <p class="w-full text-white/50 text-center py-1 text-sm">After Registration</p>
            </div>
        </div>
    
        <p>7. You can view participants’ bios and your common interests with them. </p>
        <img src={Seven} alt="Seven" />
        <p>8. Click “Generate sentence starter” to create a sentence starter based off of your common interests.</p>
        <img src={Eight} alt="Eight" />
        <p>9. If you want another sentence starter, click the “Generate Another!” button.</p>
        <img src={Nine} alt="Nine" />
        <p>10. After the party, disconnect the device from your profile by clicking the “Disconnect” button in the device registration section.</p>
        <img src={Ten} alt="Ten" />
        <p>11. Leave the party by clicking the “Leave party” button at the top of the page.</p>
        <img src={Eleven} alt="Eleven" />
        <p>12. Sign out of the website by clicking “Sign Out” in the upper right corner. You’ll be redirected back to the login page.</p>
        <img src={Twelve} alt="Twelve" />
    
    </div>
</div>