<script lang="ts">
    import UserCard from '$lib/components/ui/UserCard.svelte'
	import type { PageData } from "./$types";
    import {Accordion, AccordionItem} from '@skeletonlabs/skeleton'
    export let data: PageData;

    const {user, researcher, admin} = data;
</script>

<h1 class="h1">Permissions and User Screen</h1>

<Accordion>
    <AccordionItem>
        <svelte:fragment slot="summary"><i class="fa-solid fa-user"></i> Users</svelte:fragment>
        <svelte:fragment slot="content">
            {#each user as u}
                <UserCard {...u}/>
            {:else}
                <p>No users found!</p>
            {/each}
        </svelte:fragment>
    </AccordionItem>
    <AccordionItem open>
        <svelte:fragment slot="summary"><i class="fa-solid fa-user-graduate"></i> Researchers</svelte:fragment>
        <svelte:fragment slot="content">
            {#each researcher as u}
                <UserCard {...u}/>
            {:else}
                <p>No users found!</p>
            {/each}
        </svelte:fragment>
    </AccordionItem>
    <AccordionItem open>
        <svelte:fragment slot="summary"><i class="fa-solid fa-user-shield"></i> Administrator</svelte:fragment>
        <svelte:fragment slot="content">
            {#each admin as u}
                <UserCard {...u}/>
            {/each}
        </svelte:fragment>
    </AccordionItem>
</Accordion>