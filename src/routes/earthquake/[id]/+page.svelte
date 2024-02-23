<script>
    export let data;
    $: ({ coord, depth, id, li, time } = data);
</script>
<h1>{time}</h1>