<script lang="ts">
	import DownloadReport from '$lib/components/DownloadReport.svelte';
	import type { PageData } from './$types';
	import DatatableEarthquake from './Datatable-earthquake.svelte';
	export let data: PageData;

	const {equakes} = data;
</script>

<main>
	<div>
		<DownloadReport data={equakes}/>
		<DatatableEarthquake {data}/>
	</div>

	<div>
		Anything missing? Tell us!
		<a href="/earthquake/submit">
			<button type="button" class="btn btn-sm variant-filled"> Submit </button>
		</a>
	</div>
</main>
