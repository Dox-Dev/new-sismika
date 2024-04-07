<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<aside class="alert variant-ghost-error">
	<div class="alert-message">
		<h3 class="h3">Not logged in.</h3>
		<p>Only registered users with the Researcher role can submit events.</p>
	</div>
	<div class="alert-actions">
		<button type="button" class="btn btn-sm variant-filled" on:click={() => goto('/auth/login')}>
			Login
		</button>
	</div>
</aside>
