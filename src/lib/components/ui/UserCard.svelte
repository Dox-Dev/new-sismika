<script lang="ts">
	import { Avatar } from "@skeletonlabs/skeleton";
import BaseContentCard from "../BaseContentCard.svelte";

    export let user_id: string;
    export let name: string;
    export let email: string;
    export let picture: string;
    export let permission: number

   let selectPermission = false;

   async function changePermissions(permsVal: number) {
    const params = new URLSearchParams({
        userId: user_id,
        perms: permsVal.toString()
    });

    const res = await fetch('/api/user?' + params, {
        method: "PATCH"
    })

    console.log(res);
   }

   async function deleteUser() {
    const params = new URLSearchParams({
        userId: user_id
    })

    const res = await fetch('/api/user?' + params, {
        method: "DELETE"
    })
   }
</script>

<BaseContentCard>
    <div class="flex flex-row m-2 p-2">
        {#if permission === 0}
            <i class="fa-solid fa-user fa-3x"></i>
        {:else if permission === 1}
            <i class="fa-solid fa-user-graduate fa-3x"></i>
        {:else if permission === 2}
            <i class="fa-solid fa-user-shield fa-3x"></i>
        {/if}
        <Avatar src={picture}/>
        <div class="grow">
            <p>{name}</p>
            <p>{user_id} | {email}</p>
        </div>
        <div>
                <i on:click = {() => {selectPermission = !selectPermission}} class="fa-solid fa-user-gear"></i>
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
        <div>
            <i on:click={() => deleteUser()} class="fa-solid fa-xmark"></i>
        </div>
    </div>
</BaseContentCard>