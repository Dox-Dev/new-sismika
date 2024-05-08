<script lang="ts">
	import type { EarthquakeEvent } from '$lib/model/src/event';
	import MagnitudeCard from './MagnitudeCard.svelte';

	export let info: EarthquakeEvent;
	export let totalAffected: string;

	$: ({ mw, coord, time, depth } = info);

	$: dateTime = new Date(time).toLocaleString();
</script>

<article class="card flex flex-row">
	<MagnitudeCard magnitude={mw} />
	<section class="flex flex-col ml-5">
		<div>{coord.coordinates[0]}°E, {coord.coordinates[1]}°N</div>
		<div>Magnitude: {mw} mw</div>
		<div>Depth: {depth} km</div>
		<div>{dateTime}</div>
		<div>Total Affected: {totalAffected}</div>
	</section>
</article>
