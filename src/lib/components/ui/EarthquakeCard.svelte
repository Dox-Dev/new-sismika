<script lang="ts">
	import BaseContentCard from '../BaseContentCard.svelte';
	import MagnitudeCard from './MagnitudeCard.svelte';
	import { goto } from '$app/navigation';

	export let title: string;
	export let magnitude: number;
	export let equakeId: string;
	export let dateTime: string;

	$: dateTime = new Date(dateTime).toLocaleString();
	$: magnitudeRounded = Math.round(magnitude);
</script>

<BaseContentCard on:cardClick={() => goto(`/earthquake/${equakeId}`)}>
	<article class="flex flex-row flex-nowrap items-stretch">
		<MagnitudeCard magnitude={magnitudeRounded} />
		<section class="flex flex-col flex-1 px-10">
			<div><p class="font-bold">{title}</p></div>
			<div>
				{dateTime}
			</div>
			<div>M {magnitude} mw</div>
		</section>
	</article>
</BaseContentCard>
