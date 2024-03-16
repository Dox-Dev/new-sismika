<script>
	//export let data;

	// remove dummy data later when exporting data from endpoints
	// $: ({ coord:{long, lat}, depth, _id, li, time } = data);
	//
	export let data;
	$: ({
		_id,
		name,
		coord: { coordinates: [long, lat]}
	} = data);
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
				<td>{long}</td>
				<td>{lat}</td>
			</tr>
			<!-- {/each} -->
		</tbody>
	</table>
</div>
