
<script>
    // Your JSON data
    var data = [
      {longitude: 0, latitude:0},
      {longitude: 121.0685, latitude: 14.6539},
    ];

    //export let data;
    import OpenLayersMap from '$lib/components/OpenLayersMap.svelte';
</script>

<main>  
    <div>
        <OpenLayersMap {data}/>
    </div>
</main>