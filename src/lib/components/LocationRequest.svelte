<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Events } from "./types";
  
    async function requestLocationAccess() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            dispatcher(Events.getLocation, {long: position.coords.longitude, lat: position.coords.latitude})
          }
        );
      }
    }

    const dispatcher = createEventDispatcher();
  </script>
  
  <button on:click={requestLocationAccess} class="btn-icon btn-xl variant-filled"><i class="fa-solid fa-location-crosshairs"></i></button>