<!-- 
This SvelteKit component provides a button that, when clicked, requests the user's geolocation.
If geolocation access is granted, it dispatches an event with the user's longitude and latitude.

Functionality:
- Requests the user's geolocation when the button is clicked.
- Dispatches a custom "getLocation" event with the user's coordinates if access is granted.

The component structure:
- Script: Imports necessary functions and types, defines the location request function and event dispatcher.
- Button: Provides a button for requesting geolocation access.

Styling and behavior:
- The button uses Tailwind CSS classes for styling and Skeleton UI for component structure.
-->

<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Events } from "./types";
  
    // Function to request the user's geolocation
    async function requestLocationAccess() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Dispatch the getLocation event with the user's coordinates
            dispatcher(Events.getLocation, { long: position.coords.longitude, lat: position.coords.latitude });
          }
        );
      }
    }

    // Create an event dispatcher for custom events
    const dispatcher = createEventDispatcher();
</script>
  
<!-- Button to request geolocation access -->
<button on:click={requestLocationAccess} class="btn-icon btn-xl variant-filled">
  <i class="fa-solid fa-location-crosshairs"></i>
</button>
