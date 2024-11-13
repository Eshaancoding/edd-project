<script lang="ts">
    import { getUserMetadata } from "$lib/API/users";
    import { auth, db } from "$lib/firebase";
    import { page } from "$app/stores";
    import { onMessagingUpdate, sendMessage } from "$lib/API/chat"
    import { goto } from "$app/navigation";

    let msgs = $state([] as any[])
    let msgToSend = $state("")
    let name = $state("")

    $effect(() => { // load meta data
        async function start () {
            let data = await getUserMetadata(db, $page.params.slug)
            name = data.name
        }

        if (auth.currentUser == null) goto("/login")
        else {
            start()
            onMessagingUpdate(db, auth.currentUser!.uid, $page.params.slug, (data:any) => {
                msgs = data
                console.log(data)
            })
        }
    })

    function sendMsg () {
        sendMessage(db, auth.currentUser!.uid, $page.params.slug, msgToSend)
    }
</script>

<h1 class="w-full text-center py-4 font-bold text-[22px]">Talking to {name}</h1>
<br />
<div class="p-4 flex">
    <input bind:value={msgToSend} type='text' class="w-full p-3 rounded-[15px] border-[2px] border-black" />
    <button onclick={sendMsg} class="px-4 bg-blue-500 text-center text-white ml-2 rounded-[15px]">Send</button>
    
</div>

<div class="flex flex-col gap-2">
    {#each msgs.slice().reverse() as msg}
        <div class="px-4">
            <div class="flex flex-row gap-2 px-4 py-2 rounded-md bg-slate-100">
                <p class="font-bold">{msg.from == auth.currentUser!.uid ? "You:" : name + ": "}</p>
                <p>{msg.msg}</p> 
            </div> 
        </div>
    {/each}
</div>