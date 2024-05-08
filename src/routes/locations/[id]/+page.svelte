<script lang="ts">
	import EarthquakeCard from '$lib/components/ui/EarthquakeCard.svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import LocationCard from '$lib/components/ui/LocationCard.svelte';
	import VerticalContainer from '$lib/components/ui/containers/VerticalContainer.svelte';

	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import StaticBottomContainer from '$lib/components/ui/containers/StaticBottomContainer.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;
</script>

<div class="card flex-row">
	<article>
		<LocationCard {...data.location} />
	</article>
	<div class="mb-16">
		<Accordion>
			<AccordionItem on:click={() => {
				if (data.equake.length > 0) goto(`${$page.url.pathname}/map`)}}>
				<svelte:fragment slot="summary"><i class="fa-regular fa-map"></i>Map</svelte:fragment>
				<svelte:fragment slot="content">
					<p>No recorded earthquake in database.</p>	
				</svelte:fragment>
			</AccordionItem>
			<AccordionItem open>
				<svelte:fragment slot="summary"
					><i class="fa-solid fa-house-crack"></i>Earthquakes</svelte:fragment
				>
				<svelte:fragment slot="content">
					<VerticalContainer>
						{#each data.equake as { title, mw, _id, time }}
							<EarthquakeCard {title} magnitude={mw} equakeId={_id} dateTime={time} />
						{:else}
							<p>No recorded earthquake in database.</p>
						{/each}
					</VerticalContainer>
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
	</div>	
	<StaticBottomContainer>
		{data.location.geographicLevel}. {data.location.longname}
	</StaticBottomContainer>
</div>
