<script lang="ts">
	export let magnitude: number;
	export let text = false;
	
	$: magnitude = Math.round(magnitude);
	let intensityClass = 'one';
	let descriptor: string;
	$: switch (magnitude) {
		case 1:
			intensityClass = 'one';
			descriptor = "Scarcely Perceptible";
			break;
		case 2:
			intensityClass = 'two';
			descriptor = "Slightly Felt";
			break;
		case 3:
			intensityClass = 'three';
			descriptor = "Weak"
			break;
		case 4:
			intensityClass = 'four';
			descriptor = "Moderately Strong"
			break;
		case 5:
			intensityClass = 'five';
			descriptor = "Strong"
			break;
		case 6:
			intensityClass = 'six';
			descriptor = "Very Strong"
			break;
		case 7:
			intensityClass = 'seven';
			descriptor = "Destructive"
			break;
		case 8:
			intensityClass = 'eight';
			descriptor = "Very Destructive"
			break;
		case 9:
			intensityClass = 'nine';
			descriptor = "Devastating"
			break;
		case 10:
			intensityClass = 'ten';
			descriptor = "Completely Devastating"
			break;
	}
</script>

<div
	class="{intensityClass} align-middle text-white pd-10 text-xl font-bold flex flex-initial justify-self-stretch p-3"
>
	{magnitude} 
</div>
{#if text}
	<div
		class="{intensityClass} align-middle text-white font-bold flex flex-initial justify-self-stretch px-3"
	>
		{descriptor.toUpperCase()}
	</div>
{/if}

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
