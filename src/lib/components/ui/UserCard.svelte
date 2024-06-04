<!-- 
This SvelteKit component displays user information within a content card.
It includes the user's ID, name, email, picture, and permission level. 
The component allows for changing user permissions and deleting the user through API calls.

Props:
- user_id (string): The unique identifier of the user.
- name (string): The name of the user.
- email (string): The email address of the user.
- picture (string): The URL of the user's avatar picture.
- permission (number): The permission level of the user (0, 1, or 2).

Functions:
- changePermissions(permsVal: number): Changes the user's permissions by making a PATCH request to the API.
- deleteUser(): Deletes the user by making a DELETE request to the API.

The component structure:
- BaseContentCard: A wrapper component for styling and layout.
- User Info: Displays the user's avatar, name, ID, and email.
- Permission Controls: Allows changing the user's permissions.
- Delete User: Provides an option to delete the user.

Styling:
- The layout is flex-based, ensuring responsive and structured presentation of the information.
-->

<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import BaseContentCard from '../BaseContentCard.svelte';

	// Props passed to the component
	export let user_id: string;
	export let name: string;
	export let email: string;
	export let picture: string;
	export let permission: number;

	// State to manage permission selection UI
	let selectPermission = false;

	/**
	 * Changes the user's permissions by making a PATCH request to the API.
	 * @param permsVal - The new permission value.
	 */
	async function changePermissions(permsVal: number) {
		const params = new URLSearchParams({
			userId: user_id,
			perms: permsVal.toString()
		});

		const res = await fetch('/api/user?' + params, {
			method: 'PATCH'
		});

		// Handle the response if needed
		//console.log(res);
	}

	/**
	 * Deletes the user by making a DELETE request to the API.
	 */
	async function deleteUser() {
		const params = new URLSearchParams({
			userId: user_id
		});

		const res = await fetch('/api/user?' + params, {
			method: 'DELETE'
		});

		// Handle the response if needed
	}
</script>

<BaseContentCard>
	<!-- Container for the user information -->
	<div class="flex flex-row m-2 p-2">
		<!-- Display user icon based on permission level -->
		{#if permission === 0}
			<i class="fa-solid fa-user fa-3x"></i>
		{:else if permission === 1}
			<i class="fa-solid fa-user-graduate fa-3x"></i>
		{:else if permission === 2}
			<i class="fa-solid fa-user-shield fa-3x"></i>
		{/if}
		<!-- Display user avatar -->
		<Avatar src={picture} />
		<!-- User name and details -->
		<div class="grow">
			<p>{name}</p>
			<p>{user_id} | {email}</p>
		</div>
		<!-- Permission change icon -->
		<div>
			<i
				on:click={() => {
					selectPermission = !selectPermission;
				}}
				class="fa-solid fa-user-gear"
			></i>
			<!-- Permission change options -->
			{#if selectPermission}
				<div>
					{#if !(permission === 0)}
						<i on:click={() => changePermissions(0)} class="fa-solid fa-user"></i>
					{/if}
					{#if !(permission === 1)}
						<i on:click={() => changePermissions(1)} class="fa-solid fa-user-graduate"></i>
					{/if}
					{#if !(permission === 2)}
						<i on:click={() => changePermissions(2)} class="fa-solid fa-user-shield"></i>
					{/if}
				</div>
			{/if}
		</div>
		<!-- Delete user icon -->
		<div>
			<i on:click={() => deleteUser()} class="fa-solid fa-xmark"></i>
		</div>
	</div>
</BaseContentCard>
