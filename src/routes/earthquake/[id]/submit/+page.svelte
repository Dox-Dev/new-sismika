<script lang="ts">
	import MarkdownEditor from "$lib/components/MarkdownEditor.svelte";
    import LoginUserPromptError from "$lib/components/ui/LoginUserPromptError.svelte";
    import EarthquakeTop from "$lib/components/ui/EarthquakeTop.svelte";

	import type { PageData } from "./$types.js";
    export let form;
    let selected = form?.mediaType ?? 0;
    let content = form?.content ?? '';

    let thisForm: HTMLFormElement;

    export let data: PageData;
	$: affectedLocations = data.affected;
	$: totalAffected = affectedLocations !== undefined ? affectedLocations.reduce((n, {population}) => n + population, 0).toLocaleString() : "0";

</script>

<style>
</style>
<EarthquakeTop {totalAffected} info={data.selectedEarthquake}/>
<h1 class="h1">Media Submission Form</h1>
{#if (form?.authFail || form?.noPerms)}
    <LoginUserPromptError/>
{/if}
<form method="POST" enctype="application/x-www-form-urlencoded card space-y-4 p-4" bind:this={thisForm}>
    <article class="card flex-row m-4 p-1 space-y-3">
        <label class="label">
            <select name="mediaType" class="select" bind:value={selected}>
                <option value={0}>Image</option>
                <option value={1}>Video</option>
                <option value={2}>Article</option>
                <option value={3}>Comment</option>
            </select>
        </label>
        <div class="card m-4 p-2">
            {#if (selected in [0,1])}
                <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                    <div class="input-group-shim">Link</div>
                    <input name="url" title="Input Datetime for Earthquake Event" type="url" value={form?.url ?? ''}>
                </div>
            {:else}
                <textarea class='hidden' name="content" bind:value={content}></textarea>
                <MarkdownEditor bind:value={content}/>
            {/if}
        </div>
        <button type="button" class="btn btn-sm variant-filled" on:click={() => thisForm.requestSubmit()}>Submit</button>
    </article>
</form>