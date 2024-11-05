<script lang="ts">
    import { get_app } from '$lib/firebase';
  import { initializeApp } from 'firebase/app';
  import { getDatabase, ref, push, onValue, get, update } from 'firebase/database';
  import { onMount } from 'svelte';

  // Firebase configuration - Replace with your config
    let app:any = null
    let db:any = null
    

  // Pre-set device IDs
  const availableDevices = [
    { id: 'be231c', name: 'be231c'},
    { id: 'q12f1e', name: 'q12f1e'},
    { id: '21bs69', name: '21bs69'},
    { id: 'd2vrn6', name: 'd2vrn6'},
    { id: 'u4wrcn', name: 'u4wrcn'},
    { id: 'jrucw0', name: 'jrucw0'},
    { id: '0p6kq9', name: '0p6kq9'},
    { id: 'n8ng1x', name: 'n8ng1x'},
    { id: 'wrddur', name: 'wrddur'},
  ];

  let participants:any[] = [];
  let participantsRef;
  let showRegistrationModal = false;
  let showDeviceIdModal = false;
  let selectedParticipant:any = null;
  let selectedDevice = '';
  let deviceSelectionError = '';

  // Form data
  let name = '';
  let interests = ['', '', '', '', ''];

  // Track used devices
  let usedDevices = new Set();


  onMount(() => {
    get_app()

    participantsRef = ref(db, 'participants');
    onValue(participantsRef, (snapshot) => {
      const data = snapshot.val();
      participants = data ? Object.entries(data).map(([key, value]) => ({
        ...value,
        firebaseKey: key
      })) : [];
      
      // Update used devices
      usedDevices = new Set(participants.map(p => p.deviceId));
    });
  });

  async function handleRegistration() {
    if (!name || interests.some(interest => !interest.trim())) {
      alert('Please fill in all fields');
      return;
    }

    if (!selectedDevice) {
      alert('Please select a device');
      return;
    }

    const participant = {
      name,
      interests,
      deviceId: selectedDevice,
      timestamp: Date.now()
    };

    await push(ref(db, 'participants'), participant);
    closeRegistrationModal();
  }

  async function updateDeviceId(participantKey:any, newDeviceId:any) {
    if (usedDevices.has(newDeviceId) && participants.find(p => p.deviceId === newDeviceId)?.firebaseKey !== participantKey) {
      deviceSelectionError = 'This device is already assigned to another participant';
      return;
    }

    try {
      const updates:any = {};
      updates[`/participants/${participantKey}/deviceId`] = newDeviceId;
      await update(ref(db), updates);
      deviceSelectionError = '';
      closeDeviceIdModal();
    } catch (error) {
      console.error('Error updating device:', error);
      deviceSelectionError = 'Failed to update device. Please try again.';
    }
  }

  function getAvailableDevices(currentDeviceId = null) {
    return availableDevices.map(device => ({
      ...device,
      disabled: usedDevices.has(device.id) && device.id !== currentDeviceId
    }));
  }

  function openRegistrationModal() {
    showRegistrationModal = true;
    selectedDevice = '';
  }

  function closeRegistrationModal() {
    showRegistrationModal = false;
    name = '';
    interests = ['', '', '', '', ''];
    selectedDevice = '';
  }

  function openDeviceIdModal(participant:any) {
    selectedParticipant = participant;
    selectedDevice = participant.deviceId;
    deviceSelectionError = '';
    showDeviceIdModal = true;
  }

  function closeDeviceIdModal() {
    showDeviceIdModal = false;
    selectedParticipant = null;
    selectedDevice = '';
    deviceSelectionError = '';
  }
</script>

<main class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6">Party Registration</h1>
  
  <button
    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    on:click={openRegistrationModal}
  >
    Register for Party
  </button>

  <!-- Participants List -->
  <div class="mt-8">
    <h2 class="text-2xl font-bold mb-4">Registered Participants</h2>
    <div class="grid gap-4">
      {#each participants as participant}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="border p-4 rounded cursor-pointer hover:bg-gray-100"
          on:click={() => openDeviceIdModal(participant)}
        >
          <h3 class="font-bold">{participant.name}</h3>
          <div class="flex flex-wrap gap-2 mt-2">
            {#each participant.interests as interest}
              <span class="bg-blue-100 px-2 py-1 rounded text-sm">
                {interest}
              </span>
            {/each}
          </div>
          <div class="mt-2 text-sm text-gray-600">
            Device: {availableDevices.find(d => d.id === participant.deviceId)?.name || 'None'}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Registration Modal -->
  {#if showRegistrationModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">Register for Party</h2>
        
        <input
          type="text"
          bind:value={name}
          placeholder="Your Name"
          class="w-full border p-2 rounded mb-4"
        />

        {#each interests as interest, i}
          <input
            type="text"
            bind:value={interests[i]}
            placeholder={`Interest ${i + 1}`}
            class="w-full border p-2 rounded mb-2"
          />
        {/each}

        <select
          bind:value={selectedDevice}
          class="w-full border p-2 rounded mb-4"
        >
          <option value="">Select a Device</option>
          {#each getAvailableDevices() as device}
            <option value={device.id} disabled={device.disabled}>
              {device.name} {device.disabled ? '(In Use)' : ''}
            </option>
          {/each}
        </select>

        <div class="flex justify-end gap-2 mt-4">
          <button
            class="px-4 py-2 border rounded hover:bg-gray-100"
            on:click={closeRegistrationModal}
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            on:click={handleRegistration}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Device ID Modal -->
  {#if showDeviceIdModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">Update Device</h2>
        <p class="mb-4">Select a device for {selectedParticipant.name}:</p>
        
        <select
          bind:value={selectedDevice}
          class="w-full border p-2 rounded mb-2"
        >
          <option value="">Select a Device</option>
          {#each getAvailableDevices(selectedParticipant.deviceId) as device}
            <option value={device.id} disabled={device.disabled}>
              {device.name} {device.disabled ? '(In Use)' : ''}
            </option>
          {/each}
        </select>

        {#if deviceSelectionError}
          <p class="text-red-500 text-sm mb-4">{deviceSelectionError}</p>
        {/if}
        
        <div class="flex justify-end gap-2 mt-4">
          <button
            class="px-4 py-2 border rounded hover:bg-gray-100"
            on:click={closeDeviceIdModal}
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            on:click={() => updateDeviceId(selectedParticipant.firebaseKey, selectedDevice)}
          >
            Update Device
          </button>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>