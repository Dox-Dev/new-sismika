<script lang="ts">
	import EarthquakeCard from '$lib/components/ui/EarthquakeCard.svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import LocationCard from '$lib/components/ui/LocationCard.svelte';
	import VerticalContainer from '$lib/components/ui/containers/VerticalContainer.svelte';
	import OpenLayersMap from '../../map/OpenLayersMap.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="card flex-row">
	<article>
		<LocationCard {...data.location} />
	</article>
	<div>
		<Accordion>
			<AccordionItem>
				<svelte:fragment slot="summary"><i class="fa-regular fa-map"></i>Map</svelte:fragment>
				<svelte:fragment slot="content">
					<OpenLayersMap {data} centerCoord={data.location.coord?.coordinates} zoom={9} />
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
						{/each}
					</VerticalContainer>
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
	</div>
</div>
