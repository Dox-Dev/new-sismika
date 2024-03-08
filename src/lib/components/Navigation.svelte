<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a href="/" on:click={drawerClose}>Homepage</a></li>
		<li><a href="/about" on:click={drawerClose}>About</a></li>
		<li><a href="/map" on:click={drawerClose}>Map</a></li>
		<li><a href="/earthquake" on:click={drawerClose}>Earthquakes</a></li>
		<li><a href="/seismic" on:click={drawerClose}>Seismic Stations</a></li>
		<li><a href="/evaccenter" on:click={drawerClose}>Evacuation Centers</a></li>
		<li>
			<button type="button" class="btn" on:click={drawerClose}>
				<span><i class="fa fa-google"></i></span>
				<span>Login</span>
			</button>
		</li>
		<!--<li><a href="/login" on:click={drawerClose}>Login</a></li> -->
	</ul>
</nav>
