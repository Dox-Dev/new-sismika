<script>
	import Datatable from '$lib/components/Datatable-seismic.svelte';
	export let data;
</script>

<main>
	<div>
		<Datatable {data} />
	</div>

	<div>
		Anything missing? Tell us!
		<a href="/seismic/submit">
			<button type="button" class="btn btn-sm variant-filled"> Submit </button>
		</a>
	</div>
</main>
