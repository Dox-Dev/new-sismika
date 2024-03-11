<script>
	export let data;
	$: ({
		_id,
		time,
		coord,
		depth,
		mi,
		mb,
		ms,
		li
	} = data);
</script>

<!-- Responsive Container (recommended) -->
<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Earthquake ID</th>
				<th>Time</th>
				<th>Longitude</th>
				<th>Latitude</th>
				<th>Depth</th>
				<th>Moment Magnitude</th>
				<th>Body Wave Magnitude</th>
				<th>Surface Wave Magnitude</th>
				<th>Local Intensity</th>
			</tr>
		</thead>
		<tbody>
			<!-- {#each tableArr as row, i} -->
			<tr>
				<td>{_id}</td>
				<td>{time}</td>
				<td>{coord.coordinates[0]}</td>
				<td>{coord.coordinates[1]}</td>
				<td>{depth}</td>
				<td>{mi}</td>
				<td>{mb}</td>
				<td>{ms}</td>
				<td>{li}</td>
			</tr>
			<!-- {/each} -->
		</tbody>
	</table>
</div>
