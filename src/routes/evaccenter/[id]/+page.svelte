<script>
    //export let data;

	// remove dummy data later when exporting data from endpoints
	// $: ({ coord:{long, lat}, depth, _id, li, time } = data);
	//     
	export let data;
    $: ({ _id, name, coord: {long,lat}} = data);
	//const row = {
	//	_id: "1",
	//	name: "evaccenter",
	//	coord: {
	//		long: 111,
	//		lat: 22,
	//	}
	//}
</script>

<!-- Responsive Container (recommended) -->
<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Evacuation Center ID</th>
				<th>Name</th>
				<th>Longitude</th>
				<th>Latitude</th>
			</tr>
		</thead>
		<tbody>
			<!-- {#each tableArr as row, i} -->
				<tr>
					<td>{_id}</td>
					<td>{name}</td>
					<td>{coord.long}</td>
					<td>{coord.lat}</td>
				</tr>
			<!-- {/each} -->
		</tbody>
	</table>
</div>