<!-- 
This SvelteKit component provides functionality to download earthquake event data as a JSON file and navigate to an advanced filtering page.
It uses Skeleton UI for styling and Tailwind CSS for utility classes.

Functionality:
- Downloads the earthquake event data in JSON format when the "Download" button is clicked.
- Navigates to an advanced filtering page when the "Advanced Filtering" button is clicked.

Props:
- data (Array<EarthquakeEvent>): The dataset of earthquake events to be downloaded.

The component structure:
- Script: Imports necessary functions and types, defines the download function.
- Buttons: Provides buttons for downloading the data and navigating to the advanced filtering page.

Styling and behavior:
- The buttons use Tailwind CSS classes for styling and Skeleton UI for component structure.
-->

<script lang="ts">
	import { goto } from '$app/navigation';
	import type { EarthquakeEvent } from '$lib/model/src/event';

	// Prop passed to the component
	export let data: Array<EarthquakeEvent>;

	// Function to download the earthquake event data as a JSON file
	function downloadReport() {
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = window.URL.createObjectURL(blob);
		goto(url); // Navigate to the blob URL to trigger the download
	}
</script>

<!-- Button to download the earthquake event data -->
<button on:click={() => downloadReport()} type="button" class="btn variant-filled">
	Download
</button>
<!-- Button to navigate to the advanced filtering page -->
<button on:click={() => goto(`/reports/query`)} type="button" class="btn variant-filled">
	Advanced Filtering
</button>
