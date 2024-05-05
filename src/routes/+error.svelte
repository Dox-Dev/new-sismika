<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
</script>

<div class="flex align-middle h-dvh items-center">
    <div class="w-screen flex flex-row align-middle justify-center">
        <h1 class="h1">{$page.error?.message}</h1>
        <button type="button" class="btn variant-filled" on:click={() => goto('/')}>Back to Home</button>
    </div>
</div>
