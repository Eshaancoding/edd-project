<script lang="ts">
    import { page } from "$app/stores";
    import { auth, db } from "$lib/firebase";
    import { getParty } from "$lib/API/parties"    
    import { goto } from "$app/navigation";

    let partyId = $page.params.slug
    let userId = $state("")
    let partyInfo = $state({} as any)
    
    $effect(() => {
        async function getPartyInfo () { 
            partyInfo = await getParty(db, partyId) 
            console.log(partyInfo)
        }
        
        if (auth.currentUser == null) goto("/")
        else if (Object.keys(partyInfo).length == 0) {
            getPartyInfo()
        }
    })

    
</script>
<div>
    Hello
</div>