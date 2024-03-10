<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<nav class="list-nav p-4">
	<ul>
		<!-- <li><a href="/" on:click={drawerClose}>Homepage</a></li> -->
		<li>
			<a href="/" on:click={drawerClose}>
				<span><i class="fa fa-home" aria-hidden="true"></i></span>
				<span>Home</span>
			</a>
		</li>
		<li>
			<a href="/map" on:click={drawerClose}>
				<i class="fa-solid fa-map" />
				<span>Map</span>
			</a>
		</li>
		<li>
			<a href="/earthquake" on:click={drawerClose}>
				<i class="fa-solid fa-house-crack" />
				<span>Earthquakes</span>
			</a>
		</li>
		<li>
			<a href="/seismic" on:click={drawerClose}>
				<i class="fa-solid fa-radio" />
				<span>Seismic Stations</span>
			</a>
		</li>
		<li>
			<a href="/evaccenter" on:click={drawerClose}>
				<i class="fa-solid fa-building-circle-arrow-right" />
				<span>Evacuation Centers</span>
			</a>
		</li>
		<li>
			<a href="/auth/login" on:click={drawerClose}>
				<span><i class="fa fa-google"></i></span>
				<span>Login</span>
			</a>
		</li>
		<li>
			<a href="/auth/logout" on:click={drawerClose}>
				<span><i class="fa-solid fa-right-from-bracket"></i></span>
				<span>Logout</span>
			</a>
		</li>
		<!--<li><a href="/login" on:click={drawerClose}>Login</a></li> -->
	</ul>
</nav>
