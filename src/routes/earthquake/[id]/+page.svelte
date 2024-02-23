<script>
    export let data;
    $: ({ coord:{long, lat}, depth, _id, li, time } = data);
</script>
<h1>{long} {lat}, {depth}, {_id}, {li}, {time}</h1>