<script>
	//export let data;

	// remove dummy data later when exporting data from endpoints
	// $: ({ coord:{long, lat}, depth, _id, li, time } = data);
	export let data;
	const { selectedStation } = data;
</script>

<!-- Responsive Container (recommended) -->
<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Seismic Station ID</th>
				<th>Code</th>
				<th>Name</th>
				<th>Type</th>
				<th>Longitude</th>
				<th>Latitude</th>
			</tr>
		</thead>
		<tbody>
			<!-- {#each tableArr as row, i} -->
			<tr>
				<td>{selectedStation._id}</td>
				<td>{selectedStation.code}</td>
				<td>{selectedStation.name}</td>
				<td>{selectedStation.type}</td>
				<td>{selectedStation.coord.coordinates[0]}</td>
				<td>{selectedStation.coord.coordinates[0]}</td>
			</tr>
			<!-- {/each} -->
		</tbody>
	</table>
</div>
