<script lang="ts">
	import { goto } from "$app/navigation";
	import { joinParty, onPartiesList, leaveParty } from "$lib/API/parties";
	import { getUserMetadata } from "$lib/API/users";
	import { db, auth } from "$lib/firebase";
	import { grouping_algo } from "$lib/groupingAlgorithm";
	import { error } from "@sveltejs/kit";
	import { onMount } from "svelte";
	import { onAuthStateChanged, getAuth } from "firebase/auth";
	import type { PageData } from "./$types";

	// export let data;
	// console.log("data.hello", data)
	// let user = data.user;

	let d = [] as any[];
	let partiesJoined = [] as string[];
	let name = "User";

	onMount(() => {
		onAuthStateChanged(auth, (user) => {
			if (user === null) goto("/login");
			else {
				getUserMetadata(db, user!.uid).then((value: any) => (name = value.name));

				onPartiesList(db, (data: any) => {
					d = data;
					partiesJoined = [];
					Object.keys(data).forEach((partyId: string) => {
						data[partyId].participants.forEach((element: any) => {
							if (element.profileId == user!.uid) {
								partiesJoined.push(partyId);
							}
						});
					});
				});
			}
		});
	});

	async function joinP(partyId: string) {
		console.log("joinP", auth.currentUser);
		let metadata = await getUserMetadata(db, auth.currentUser!.uid);

		await joinParty(db, metadata.name, auth.currentUser!.uid, partyId);

		grouping_algo(db, partyId);
	}

	async function leaveP(partyId: string) {
		await leaveParty(db, partyId, auth.currentUser!.uid);
		grouping_algo(db, partyId);
	}
</script>

<div class="pt-[64px] bg-orange-50 min-h-screen">
	<div class="container">
		<div>
            <h1 class="w-full py-4 text-4xl">
                Hello {name}!
            </h1>
            <p>Attend a party. Start a conversation. Make new relationships.</p>
        </div>

		<div class="flex flex-row justify-end">
			<a href="/parties/createParty" class="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 transition-colors text-white rounded-lg px-3 py-2">
				<svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                Create Party
			</a>
		</div>
	</div>

	<div class="pt-4 pb-8 container grid lg:grid-cols-3 gap-4">
		{#each Object.values(d) as value}
			<div class="px-6 py-5 border border-gray-400 rounded-[15px] flex flex-col gap-6 justify-between">
				<div class="flex flex-col gap-6">
                    <div class="info">
                        <div class="text-2xl">
                            {value.name}
                        </div>
                        <div class="flex">
                            @ {value.location}
                        </div>
                        {#if value.description}<div class="flex">
                                Description: {value.description}
                            </div>{/if}
                    </div>
                    <div class="flex flex-col gap-2">
                        Partipants
                        {#each value.participants as any[] as part}
                            <a href={"/profile/" + part.profileId}>
                                <div class="p-2 w-full border border-gray-300 rounded-lg w-full">
                                    {part.name}
                                </div>
                            </a>
                        {/each}
                    </div>
                </div>

				<div class="flex gap-2 justify-end">
					{#if partiesJoined.includes(value.partyId)}
						<button
							on:click={() => leaveP(value.partyId)}
							class="hover:bg-red-600/10 transition-colors text-red-600 rounded-lg px-3 py-2"
						>
							Leave Party
						</button>
						<a href={"/parties/" + value.partyId} class="bg-black hover:bg-gray-600 transition-colors text-white rounded-lg px-3 py-2">
							Go to Party
						</a>
					{:else}
						<button
							on:click={() => joinP(value.partyId)}
							class="bg-black hover:bg-gray-600 transition-colors text-white rounded-lg px-3 py-2"
						>
							Join Party
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
