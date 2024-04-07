<script lang="ts">
    export let magnitude: number;
    $: magnitude = Math.round(magnitude)
    let intensityClass = 'one'
    $: switch (magnitude) {
        case 1:
            intensityClass = 'one'
            break;
        case 2:
            intensityClass = 'two'
            break
        case 3:
            intensityClass = 'three'
            break
        case 4:
            intensityClass = 'four'
            break
        case 5:
            intensityClass = 'five'
            break
        case 6:
            intensityClass = 'six'
            break
        case 7: 
            intensityClass = 'seven'
            break
        case 8:
            intensityClass = 'eight'
            break
        case 9:
            intensityClass = 'nine'
            break
        case 10:
            intensityClass = 'ten'
            break
    }
</script>

<style>
    @import url('../../../routes/vars.css');
    .one {
        background-color: var(--intensity-1);
    }
    .two {
        background-color: var(--intensity-2);
    }
    .three {
        background-color: var(--intensity-3);
    }
    .four {
        background-color: var(--intensity-4);
    }
    .five {
        background-color: var(--intensity-5);
    }
    .six {
        background-color: var(--intensity-6);
    }
    .seven {
        background-color: var(--intensity-7);
    }
    .eight {
        background-color: var(--intensity-8);
    }
    .nine {
        background-color: var(--intensity-9);
    }
    .ten {
        background-color: var(--intensity-max);
    }
</style>

<div class="{intensityClass} align-middle text-white pd-10 text-xl font-bold flex flex-initial justify-self-stretch p-3">
    {magnitude}
</div>