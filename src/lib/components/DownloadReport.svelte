<script lang="ts">
	import { goto } from '$app/navigation';
	import type { EarthquakeEvent } from '$lib/model/src/event';

	export let data: Array<EarthquakeEvent>;

	function downloadReport() {
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = window.URL.createObjectURL(blob);
		goto(url);
	}
</script>

<button on:click={() => downloadReport()} type="button" class="btn variant-filled"
	>Download
</button>
