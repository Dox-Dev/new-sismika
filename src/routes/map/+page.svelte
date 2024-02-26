
<script>
    import OpenLayersMap from '$lib/components/OpenLayersMap.svelte';
    import Datatable from '$lib/components/Datatable.svelte';

    // Your JSON data
    export let data;
</script>

<main>  
    <div>
        <OpenLayersMap {data}/>
    </div>

    <div>
        <Datatable {data}/>
    </div>
</main>