<script>
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

<div class="bg-green-950 text-yellow-100 w-full p-6 absolute flex gap-3 flex-col">
    <div class="bg-clouds text-[40px] font-serif">
        EDD Team 7
    </div>

    <div>
        <span class="font-bold">Project Manager:</span> Harrison Mesh <br />
        Harrison Mesh, Ethan Yung, Eshaan Barkataki
    </div>

    <div>
        <span class="font-bold">Problem Identification:</span> Introverted people have difficulty with conversing with strangers at a social gathering, i.e. dinner or social party.       
    </div>

    <div>
        <span class="font-bold">Solution:</span> We built a device and website to match people together based on similar interests and give them the opportunity to know more about each other before a conversation, helping to reduce the anxiety of starting a conversation.
    </div>

    <div class="bg-clouds text-[35px] font-serif my-6">
        Website Instructions
    </div>

    <p>1. Navigate to <a class="underline" href="https://edd-black.vercel.app">https://edd-black.vercel.app</a> </p>
    <img src={One} alt="One" />    
    <p>2. Click the "Log In" or "Sign Up" button in the upper right corner.</p>
    <img src={Two} class="w-[400px]" alt="Two" />    
    <p>3. After logging in or signing up and making a profile with your credentials, you will see your dashboard.</p>
    <img src={Three} class="w-[800px]" alt="Three" />    
    <p>4. Locate a party that you would like to join and click the “Join Party” button. Your name should pop up under the party.</p>
    <img src={Four} class="w-[400px]" alt="Four" />    
    <p>5. Click the “Go to Party” button and the party details will pop up.</p>    
    <img src={Five} class="w-[800px]" alt="Five" />    
    <p>6. You can register a device now. Look at your device and read the Device ID. On the website, click “Register” to connect your profile with the device. After registering, your name and a colored shape should show up on the device. If you see your colored shape on another person’s name tag, it means they have similar interests to you!</p>
    <img src={Six} class="w-[800px]" alt="Six" />
    <div class="flex"> 
        <div class="flex flex-col">
            <img src={Before} alt="before" />
            <p class="w-full text-center py-4 text-[18px]">Before Registration</p>
        </div>

        <div class="flex flex-col">
            <img src={After} alt="After" />
            <p class="w-full text-center py-4 text-[18px]">After Registration</p>
        </div>
    </div>    

    <p>7. You can view participants’ bios and your common interests with them. </p>
    <img src={Seven} class="w-[800px]" alt="Seven" />
    <p>8. Click “Generate sentence starter” to create a sentence starter based off of your common interests.</p>
    <img src={Eight} class="w-[800px]" alt="Eight" />
    <p>9. If you want another sentence starter, click the “Generate Another!” button.</p>
    <img src={Nine} class="w-[800px]" alt="Nine" />
    <p>10. After the party, disconnect the device from your profile by clicking the “Disconnect” button in the device registration section.</p>
    <img src={Ten} class="w-[800px]" alt="Ten" />
    <p>11. Leave the party by clicking the “Leave party” button at the top of the page.</p>
    <img src={Eleven} class="w-[800px]" alt="Eleven" />
    <p>12. Sign out of the website by clicking “Sign Out” in the upper right corner. You’ll be redirected back to the login page.</p>
    <img src={Twelve} class="w-[800px]" alt="Twelve" />

</div>