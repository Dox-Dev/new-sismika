<script lang="ts">
	import LoginUserPromptError from "$lib/components/ui/LoginUserPromptError.svelte";

    export let form;
    let entryForm: HTMLFormElement;
</script>

<h1 class="h1"> Earthquake Entry Submission </h1>
<hr>
{#if (form?.authFail || form?.noPerms)}
    <LoginUserPromptError/>
{/if}
<form method="POST" enctype="application/x-www-form-urlencoded" class="flex-col flex card space-y-4 p4" bind:this={entryForm}>
    <article class="card flex-row m-4 p-1 space-y-3">
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div class="input-group-shim">Datetime</div>
            <input name="time" title="Input Datetime for Earthquake Event" type="datetime-local" value={form?.time ?? ''}>
        </div>
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div class="input-group-shim">Longitude</div>
            <input class:input-error={!form?.long && form?.missing} type="number" name="long" title="Longitude" step="any" value={form?.long ?? ''}/>
            <div class="input-group-shim">°</div>
        </div>
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div class="input-group-shim">Latitude</div>
            <input type="number" name="lat" title="Latitude" step="any" value={form?.lat ?? ''}/>
            <div class="input-group-shim">°</div>
        </div>
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div class="input-group-shim">Depth</div>
            <input type="number" name="depth" title="Depth" step="any" value={form?.depth ?? ''}/>
            <div class="input-group-shim">km</div>
        </div>
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div class="input-group-shim">Moment Magnitude</div>
            <input type="number" name="mw" title="Magnitude" step="any" value={form?.mw ?? ''}/>
            <div class="input-group-shim">mw</div>
        </div>
        <textarea name="li" class="textarea" rows="4" placeholder="Enter local intensities." value={form?.li ?? ''} />
    </article>
    <button type="button" class="btn btn-sm variant-filled" on:click={() => entryForm.requestSubmit()}>Submit</button>
</form>