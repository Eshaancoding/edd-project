<script lang="ts">
	import { page } from "$app/stores";
	import { auth, db } from "$lib/firebase";
	import { getParty } from "$lib/API/parties";
	import { getUserMetadata } from "$lib/API/users";
	import { cosineSimilarity } from "$lib/helper";
	import { onAvailableDevices, registerDevice, unregisterDevice, updateDisplayName } from "$lib/API/devices";
	import { goto } from "$app/navigation";
	import { callLLM } from "$lib/LLM";
	import { onMount } from "svelte";
	import { onAuthStateChanged } from "firebase/auth";
	import { leaveParty } from "$lib/API/parties";
	import { grouping_algo } from "$lib/groupingAlgorithm";

	// Firebase Auth
	let currentUser = $state(undefined as Object | undefined | null);
	onMount(() => {
		onAuthStateChanged(auth, (user) => {
			if (user === null) goto("/login");
			else {
				currentUser = user;
			}
		});
	});

	let partyId = $page.params.slug;
	let partyInfo = $state({} as any);
	let userMetaData = $state({} as any);
	let availableDevices = $state([] as any[]);
	let connectedDevice = $state("");
	let sortedPartipants = $state([] as any[]);
	let groups = $state([] as any[]);
	let groupsInterests = $state({} as { [id: number]: string[] });
	let llmGeneratingStatus = $state({} as { [id: number]: string });
	let llmGeneratingStatusPTP = $state({} as { [id: number]: string });
	let currentGroup = $state("");

	function randomInterest(arr: string[]) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	function randomInterestGroup(arr: string[]) {
		// find unique array
		let uniqueArr = [] as string[];
		arr.forEach((value: string) => {
			if (!uniqueArr.includes(value)) uniqueArr.push(value);
		});

		let idxOne = 0;
		let idxTwo = 0;
		while (idxOne == idxTwo) {
			idxOne = Math.floor(Math.random() * arr.length);
			idxTwo = Math.floor(Math.random() * arr.length);
		}

		return [uniqueArr[idxOne], uniqueArr[idxTwo]];
	}

	$effect(() => {
		async function getInfo() {
			// get party information and user meta data
			let pi = await getParty(db, partyId);
			let metadata = {} as any;
			let idToName = {} as { [id: string]: string };
			for (let i = 0; i < pi.participants.length; i++) {
				let data = await getUserMetadata(db, pi.participants[i].profileId);
				metadata[pi.participants[i].profileId] = data;
				idToName[pi.participants[i].profileId] = data.name;
			}
			sortedPartipants = sortPartipants(pi.participants, metadata);

			// update available devices
			onAvailableDevices(db, currentUser!.uid, partyId, (data: any, isConnected: boolean) => {
				if (isConnected) {
					connectedDevice = data;
				} else {
					availableDevices = data;
				}
			});

			userMetaData = metadata;
			partyInfo = pi;

			// organize groups
			if (Object.hasOwn(pi, "clusterResult")) {
				let groupDataResult: { [id: number]: any[] } = {};
				Object.keys(pi.clusterResult).forEach((userId: string) => {
					let name = idToName[userId];
					let id = userId;
					let clusterId = pi.clusterResult[userId];
					if (!(clusterId in groupDataResult)) {
						groupDataResult[clusterId] = [];
					}

					if (id == currentUser!.uid) {
						currentGroup = clusterId;
					}

					groupDataResult[clusterId].push({
						name: name,
						id: id,
					});

					if (!(clusterId in groupsInterests)) {
						groupsInterests[clusterId] = [];
					}

					if (!(clusterId in llmGeneratingStatus)) {
						llmGeneratingStatus[clusterId] = "available";
					}

					groupsInterests[clusterId] = groupsInterests[clusterId].concat(metadata[userId].interests);
				});
				groups = Object.entries(groupDataResult)
					.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
					.map((value) => value[1]);
			}
		}

		if (currentUser === null) goto("/");
		else if (Object.keys(partyInfo).length == 0 && Object.keys(userMetaData).length == 0) {
			getInfo();
		}
	});

	function sortPartipants(arr: any[], metadata: any) {
		let res = [] as any[];

		if (metadata == null || Object.keys(metadata).length == 0) return [];
		if (arr == null || Object.keys(arr).length == 0) return [];

		arr.forEach((partipant: any) => {
			if (partipant.profileId != currentUser!.uid) {
				res.push({
					name: partipant.name,
					profileId: partipant.profileId,
					similarity: cosineSimilarity(metadata[partipant.profileId]["embedding"][0], metadata[currentUser!.uid]["embedding"][0]),
				});

				if (!(partipant.profileId in llmGeneratingStatusPTP)) {
					llmGeneratingStatusPTP[partipant.profileId] = "available";
				}
			}
		});

		let sortedData = res.sort((a, b) => b.similarity - a.similarity);

		if (connectedDevice.length > 0) {
			// connected to device
			updateDisplayName(db, connectedDevice, sortedData[0].name);
		}

		return sortedData;
	}

	async function leaveP(partyId: string) {
		await leaveParty(db, partyId, auth.currentUser!.uid);
		grouping_algo(db, partyId);
		goto("/parties");
	}
</script>

<div class="pt-[64px] pb-8 bg-orange-50 min-h-screen">
	<div class="container">
		{#if Object.keys(partyInfo).length > 0}
			<div class="flex flex-col">
				<div class="flex flex-row justify-between items-start mt-4 mb-6">
                    <div class="flex flex-col gap-2 max-w-[700px]">
                        <div class="flex flex-row justify-between">
                            <h1 class="text-4xl">{partyInfo.name}</h1>
                        </div>
                        <p>@ {partyInfo.location}</p>
                    </div>
                    <button onclick={() => leaveP(partyId)} class="hover:bg-red-600/10 transition-colors text-red-600 rounded-lg px-3 py-2">
                        Leave Party
                    </button>
                </div>

				<div class="p-4 rounded-[15px] bg-orange-100" class:bg-orange-200={connectedDevice.length > 0}>
					{#if connectedDevice.length > 0}
						<div class="flex flex-row justify-between">
							<p class="py-2"><span class="font-bold">Connected Device: </span> {connectedDevice}</p>
							<button
								onclick={() => {
									unregisterDevice(db, connectedDevice);
									connectedDevice = "";
								}}
								class="bg-black hover:bg-gray-600 transition-colors text-white rounded-lg px-3 py-2"
							>
								Disconnect
							</button>
						</div>
					{:else}
						<p class="font-bold py-2">Register Device</p>
						<div class="flex flex-col gap-4">
							{#each Object.keys(availableDevices) as device}
								<div class="flex flex-row bg-orange-200/70 items-center w-full p-2 rounded-[15px] justify-between">
									<p class="mx-2">{device}</p>
									<button
										onclick={() =>
											registerDevice(
												db,
												userMetaData[currentUser!.uid]["name"],
												currentGroup,
												currentUser!.uid,
												partyId,
												device
											)}
										class="bg-black hover:bg-gray-600 transition-colors text-white rounded-lg px-3 py-2">Register</button
									>
								</div>
							{/each}
						</div>
					{/if}
				</div>
				<br />

				{#if groups.length > 0}
					<h2 class="text-2xl mb-4 mt-6">Groups</h2>
					<!-- <button>Go to another group!</button> -->
					<div class="flex gap-2">
						{#each groups as group, i}
							<div class="w-[500px] bg-orange-100 p-4 rounded-[15px]">
								<p class="font-bold py-2">Group #{i + 1}</p>
								{#each group as person}
									{#if person.id == currentUser!.uid}
										<p class="font-bold">You ({person.name})</p>
									{:else}
										<p>{person.name}</p>
									{/if}
								{/each}

								<br />

								{#if llmGeneratingStatus[i] == "available"}
									<button
										onclick={async () => {
											llmGeneratingStatus[i] = "generating";
											llmGeneratingStatus[i] = await callLLM(randomInterestGroup(groupsInterests[i]));
										}}
                                        class="bg-black hover:bg-gray-600 transition-colors text-white rounded-lg px-3 py-2"
									>
										Generate sentence starter!
									</button>
								{:else if llmGeneratingStatus[i] == "generating"}
									<p>Generating...</p>
								{:else}
									<p>Sentence starter: {llmGeneratingStatus[i]}</p>
									<br />
									<button
										onclick={async () => {
											llmGeneratingStatus[i] = "generating";
											llmGeneratingStatus[i] = await callLLM(randomInterestGroup(groupsInterests[i]));
										}}
                                        class="bg-black hover:bg-gray-600 transition-colors text-white rounded-lg px-3 py-2"
									>
										Generate Another!
									</button>
								{/if}

								<br />
							</div>
						{/each}
					</div>
				{/if}

				<br />
				<h2 class="text-2xl mb-4 mt-6">Similar to You</h2>
				{#each sortedPartipants as partipant}
					<div class="p-4 rounded-[15px] bg-orange-100 mb-4">
						<p class="font-bold py-2">{partipant.name}</p>
						<p><span class="font-bold">Bio:</span> {userMetaData[partipant.profileId]["bio"]}</p>
						<br />
						<div class="flex flex-row gap-4 w-[400px]">
							<div>
								<p>Interests:</p>
								{#each userMetaData[partipant.profileId].interests as interest}
									<p class="mx-4">{interest}</p>
								{/each}
							</div>
							<div>
								<p>Your Interests:</p>
								{#each userMetaData[currentUser!.uid].interests as interest}
									<p class="mx-4">{interest}</p>
								{/each}
							</div>

							<div>
								{#if llmGeneratingStatusPTP[partipant.profileId] == "available"}
									<button
										onclick={async () => {
											llmGeneratingStatusPTP[partipant.profileId] = "generating";
											llmGeneratingStatusPTP[partipant.profileId] = await callLLM([
												randomInterest(userMetaData[currentUser!.uid]["interests"]),
												randomInterest(userMetaData[partipant.profileId]["interests"]),
											]);
										}}
                                        class="bg-black hover:bg-gray-600 transition-colors text-white rounded-lg px-3 py-2"
									>
										Generate sentence starter!
									</button>
								{:else if llmGeneratingStatusPTP[partipant.profileId] == "generating"}
									<p>Generating...</p>
								{:else}
									<p class="w-full">Sentence starter: {llmGeneratingStatusPTP[partipant.profileId]}</p>
									<br />
									<button
										onclick={async () => {
											llmGeneratingStatusPTP[partipant.profileId] = "generating";
											llmGeneratingStatusPTP[partipant.profileId] = await callLLM([
												randomInterest(userMetaData[currentUser!.uid]["interests"]),
												randomInterest(userMetaData[partipant.profileId]["interests"]),
											]);
										}}
                                        class="bg-black hover:bg-gray-600 transition-colors text-white rounded-lg px-3 py-2"
									>
										Generate Another!
									</button>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
