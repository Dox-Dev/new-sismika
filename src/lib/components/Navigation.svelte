<!-- 
This SvelteKit component provides a navigation drawer with various links and user-specific options.
It uses Skeleton UI for the drawer store and Tailwind CSS for styling. The component includes logout functionality and displays user-specific content based on the user's permissions.

Functionality:
- Provides navigation links to different parts of the application.
- Displays user-specific options based on the user's permission level.
- Includes a logout function to log the user out and reload the page.
- Shows user information or a login prompt at the bottom of the drawer.

Props:
- user (User | undefined): The current user object, if the user is logged in.

The component structure:
- Script: Imports necessary functions and types, defines the drawer store, and includes logout and drawer close functions.
- Nav: Contains navigation links and user-specific options.
- Style: Includes styles for the bottom content and user image.

Styling and behavior:
- The navigation drawer uses Tailwind CSS classes for styling.
- The user image is styled to maintain aspect ratio and have rounded corners.

Dependencies:
- Skeleton UI: Provides the drawer store.
- Tailwind CSS: Provides utility classes for responsive design and styling.
- SvelteKit: Provides navigation functionality.
-->

<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton'; // Import drawer store from Skeleton UI
	import avatarImage from '$lib/assets/dummy-avatar.jpeg'; // Import a dummy avatar image
	import type { User } from '$lib/model/src/user'; // Import User type
	import { goto } from '$app/navigation'; // Import SvelteKit navigation function

	// Initialize drawer store
	const drawerStore = getDrawerStore();

	// Function to close the drawer
	function drawerClose(): void {
		drawerStore.close();
	}

	// Function to log out the user
	async function logout() {
		const res = await fetch('/auth/logout', {
			method: 'DELETE'
		});
		location.reload(); // Reload the page after logout
	}

	// Prop for the current user
	export let user: User | undefined;
</script>

<!-- Navigation drawer -->
<nav class="list-nav p-4">
	<ul>
		<li>
			<a href="/" on:click={drawerClose}>
				<span><i class="fa fa-home" aria-hidden="true"></i></span>
				<span>Home</span>
			</a>
		</li>
		<li>
			<a href="/tutorial" on:click={drawerClose}>
				<span><i class="fa fa-lightbulb"></i></span>
				<span>Tutorial</span>
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
			<a href="/locations" on:click={drawerClose}>
				<i class="fa-solid fa-location-dot"></i>
				<span>Locations</span>
			</a>
		</li>
		<li>
			<a href="/seismic" on:click={drawerClose}>
				<i class="fa-solid fa-radio" />
				<span>Seismic Stations</span>
			</a>
		</li>
		<li>
			<a href="https://docs.google.com/forms/d/e/1FAIpQLSfG4lr-Ry9KDy5KAi1ZfgtajBy_tSUz3avkoHGH-8sTleHytw/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer" on:click={drawerClose}>
				<i class="fa-solid fa-comment"></i>
				<span>Beta Test Survey Form</span>
			</a>
		</li>
		{#if user}
			{#if user.permission === 0} 
				<li>
					<a href="https://docs.google.com/forms/d/e/1FAIpQLSeypAHpAwbuNvYmcTnuDhc4JUypd9bqd-VbmUUyFVZaNjP4FA/viewform" target="_blank" rel="noopener noreferrer" on:click={drawerClose}>
						<span><i class="fa-solid fa-paperclip"></i></span>
						<span>Researcher Role Request</span>
					</a>
				</li>
			{/if}
			{#if user.permission > 0}
				<li>
					<a href="/reports" on:click={drawerClose}>
						<span><i class="fa-solid fa-paperclip"></i></span>
						<span>Reports</span>
					</a>
				</li>
			{/if}
			{#if user.permission > 1}
				<li>
					<a href="/admin" on:click={drawerClose}>
						<span><i class="fa-solid fa-hammer"></i></span>
						<span>Administrator</span>
					</a>
				</li>
			{/if}
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
	</ul>
</nav>

<!-- User information or login prompt at the bottom of the drawer -->
<nav class="list-nav p-4 bottom-content">
	<ul>
		<li>
			{#if user}
				<a href="/map" on:click={() => logout()}>
					<span class="m10"><img src={user.picture} alt="" /></span>
					<span>{user.name}</span>
				</a>
			{:else}
				<a href="/auth/login" on:click={drawerClose}>
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
