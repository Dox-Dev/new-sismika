<!---
This SvelteKit component displays an alert message for users who are not logged in.
It informs them that only registered users with the Researcher role can submit events,
and provides a button to navigate to the login page.

The component structure:
- Alert: An alert box with a message and a login button.
- Message: Contains a heading and a paragraph explaining the restriction.
- Actions: Contains a button that navigates to the login page when clicked.
-->

<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<aside class="alert variant-ghost-error">
	<div class="alert-message">
		<!-- Alert heading -->
		<h3 class="h3">Not logged in.</h3>
		<!-- Alert message -->
		<p>Only registered users with the Researcher role can submit events.</p>
	</div>
	<div class="alert-actions">
		<!-- Login button that navigates to the login page -->
		<button type="button" class="btn btn-sm variant-filled" on:click={() => goto('/auth/login')}>
			Login
		</button>
	</div>
</aside>
