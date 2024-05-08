<script lang="ts">
	import type { PageData } from "./$types";
	import OpenLayersMap from '../../../map/OpenLayersMap.svelte';
    import { page } from '$app/stores';
    
    export let data: PageData
</script>

{#if data.equake.length > 0}
    <OpenLayersMap {data} centerCoord={data.location.coord?.coordinates} zoom={9} />
{:else}
    <p>No recorded earthquake in database.</p>
{/if}