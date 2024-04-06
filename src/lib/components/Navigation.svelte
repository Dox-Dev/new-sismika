<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import avatarImage from '$lib/assets/dummy-avatar.jpeg';
	import type { User } from '$lib/model/src/user';
	import { goto } from '$app/navigation';

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}

	async function logout() {
		const res = await fetch('/auth/logout', {
			method: 'DELETE'
		})
		location.reload()
	}
	export let user: User | undefined;
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
		{#if user}
			<li>
				<a href="/" on:click={logout}>
					<span><i class="fa-solid fa-right-from-bracket"></i></span>
					<span>Logout</span>
				</a>
			</li>
		{:else}
			<li>
				<a href="/auth/login" on:click={drawerClose}>
					<span><i class="fa fa-google"></i></span>
					<span>Login</span>
				</a>
			</li>
		{/if}
		<!--<li><a href="/login" on:click={drawerClose}>Login</a></li> -->
	</ul>
</nav>

<nav class="list-nav p-4 bottom-content">
	<ul>
		<li>
			{#if user}
				<a href="/auth/logout" on:click={drawerClose}>
					<!-- <span><i class="fa-solid fa-right-from-bracket"></i></span> -->
					<span class="m10"><img src={user.picture} alt="" /></span>
					<span>{user.name}</span>
				</a>
			{:else}
				<a href="/auth/login" on:click={drawerClose}>
					<!-- <span><i class="fa-solid fa-right-from-bracket"></i></span> -->
					<span class="m10"><img src={avatarImage} alt="" /></span>
					<span>Not logged in.</span>
				</a>
			{/if}
		</li>
	</ul>
</nav>

<style>
	.bottom-content {
		position: absolute;
		bottom: 0;
	}

	.m10 img {
		width: 100%;
		height: 28px;
		object-fit: cover; /* Maintain aspect ratio */
		border-radius: 50%;
	}
</style>
