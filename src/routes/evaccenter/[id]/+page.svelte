<script>
	//export let data;

	// remove dummy data later when exporting data from endpoints
	// $: ({ coord:{long, lat}, depth, _id, li, time } = data);
	//
	export let data;
	const { selectedEvac } = data;
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
				<td>{selectedEvac._id}</td>
				<td>{selectedEvac.name}</td>
				<td>{selectedEvac.coord.coordinates[0]}</td>
				<td>{selectedEvac.coord.coordinates[1]}</td>
			</tr>
			<!-- {/each} -->
		</tbody>
	</table>
</div>
