<script>
	//export let data;

	// remove dummy data later when exporting data from endpoints
	// $: ({ coord:{long, lat}, depth, _id, li, time } = data);
	const row = {
		_id: '1',
		code: '123',
		name: 'evaccenter',
		type: 'abc',
		coord: {
			long: 111,
			lat: 22
		}
	};
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
				<td>{row._id}</td>
				<td>{row.code}</td>
				<td>{row.name}</td>
				<td>{row.type}</td>
				<td>{row.coord.long}</td>
				<td>{row.coord.lat}</td>
			</tr>
			<!-- {/each} -->
		</tbody>
	</table>
</div>
