<script lang="ts">
	import { goto } from "$app/navigation";
	import type { Coordinates } from "$lib/model/src/util";
    import BaseContentCard from "../BaseContentCard.svelte";
    
    export let _id: string;
    export let code: string;
    export let name: string;
    export let type: string;
    export let coord: Coordinates;
</script>

<BaseContentCard on:cardClick = {() => goto(`/seismic/${_id}`)}>
    <article class = "flex flex-row flex-nowrap items-stretch">
        <section class="flex flex-col flex-10 px-1">
            <p>{code}</p>
            <p>{type}</p>
        </section>
        <section>
            <p>{name}</p>
            <p class="italic">{coord.coordinates[0]}°, {coord.coordinates[1]}°</p>
        </section>

    </article>
</BaseContentCard>

