<script>
	//import OpenLayersMap from '$lib/components/OpenLayersMap.svelte';
	import OpenLayersMap from './OpenLayersMap.svelte';

	// Your JSON data
	export let data;
</script>

<main>
	<div>
		<OpenLayersMap {data} />
	</div>
</main>
