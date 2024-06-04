<!-- 
This SvelteKit component displays the magnitude of an earthquake along with its descriptive intensity.
It changes its appearance based on the magnitude value and can optionally show a text descriptor.

Props:
- magnitude (number): The magnitude of the earthquake.
- text (boolean): A flag indicating whether to display the text descriptor of the intensity.

The component structure:
- A main div that displays the magnitude with a background color corresponding to its intensity.
- An optional div that displays the text descriptor of the intensity if the 'text' prop is true.

Styling:
- The background colors are defined in an external CSS file, imported here.
- Each intensity level has a corresponding CSS class that sets its background color.
-->

<script lang="ts">
	// Props passed to the component
	export let magnitude: number;
	export let text = false;

	// Reactive statement to round the magnitude value
	$: magnitude = Math.round(magnitude);

	// Variables to hold the CSS class and descriptive text based on the magnitude
	let intensityClass = 'one';
	let descriptor: string;

	// Reactive statement to set the CSS class and descriptor based on the magnitude
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
			descriptor = "Weak";
			break;
		case 4:
			intensityClass = 'four';
			descriptor = "Moderately Strong";
			break;
		case 5:
			intensityClass = 'five';
			descriptor = "Strong";
			break;
		case 6:
			intensityClass = 'six';
			descriptor = "Very Strong";
			break;
		case 7:
			intensityClass = 'seven';
			descriptor = "Destructive";
			break;
		case 8:
			intensityClass = 'eight';
			descriptor = "Very Destructive";
			break;
		case 9:
			intensityClass = 'nine';
			descriptor = "Devastating";
			break;
		case 10:
			intensityClass = 'ten';
			descriptor = "Completely Devastating";
			break;
		default:
			intensityClass = 'one';
			descriptor = "Unknown Intensity";
			break;
	}
</script>

<!-- Main div displaying the magnitude with a background color based on intensity -->
<div
	class="{intensityClass} align-middle text-white pd-10 text-xl font-bold flex flex-initial justify-self-stretch p-3"
>
	{magnitude}
</div>

<!-- Optional div displaying the text descriptor if the 'text' prop is true -->
{#if text}
	<div
		class="{intensityClass} align-middle text-white font-bold flex flex-initial justify-self-stretch px-3"
	>
		{descriptor.toUpperCase()}
	</div>
{/if}

<style>
	@import url('../../../routes/vars.css');
	/* CSS classes for different intensity levels with corresponding background colors */
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
