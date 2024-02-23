
<script>
    // Your JSON data
    var data = [
      {long: 0, lat:0},
      {long: 121.0685, lat: 14.6539},
    ];

    //export let data;
    import OpenLayersMap from '$lib/components/OpenLayersMap.svelte';
</script>

<main>  
    <div>
        <OpenLayersMap {data}/>
    </div>
</main>