
<script>
    import OpenLayersMap from '$lib/components/OpenLayersMap.svelte';
    import Datatable from '$lib/components/Datatable.svelte';

    // Your JSON data
    var data = [
    {
    id: 'owo',
    time: '1708665054',
    coord: {
    long: 0,
    lat: 0,
    },
    depth: 500,
    mw: 1, //moment magnitude, mi
    mb: 2, //body-wave magnitude
    ms: 3, //surface wave magnitude.
    li: 'local intensity :>', //string list of local intensities
    },

    {
    id: 'uwu',
    time: '1708665383',
    coord: {
    long: 121.0685,
    lat: 14.6539,
    },
    depth: 123456789,
    mw: 4, //moment magnitude, mi
    mb: 5, //body-wave magnitude
    ms: 6, //surface wave magnitude.
    li: 'local intensity :<', //string list of local intensities
    },

    {
    id: 'ono',
    time: '1708613123',
    coord: {
    long: 50.1234,
    lat: 249.6932,
    },
    depth: 123456789,
    mw: 4, //moment magnitude, mi
    mb: 5, //body-wave magnitude
    ms: 6, //surface wave magnitude.
    li: 'hi hello', //string list of local intensities
    }
    ];
</script>

<main>  
    <div>
        <OpenLayersMap {data}/>
    </div>

    <div>
        <Datatable {data}/>
    </div>
</main>