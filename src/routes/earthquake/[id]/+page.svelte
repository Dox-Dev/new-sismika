<script>
	export let data;
	$: ({
		coord: { long, lat },
		depth,
		_id,
		li,
		time
	} = data);
</script>

<h1>
	Longitude: {long} degrees, Latitude: {lat} degrees, Depth:{depth}km, ID: {_id}, Local Intensity: {li},
	Time: {time}
</h1>
