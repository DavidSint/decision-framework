<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Dimension, Option } from '$lib/types';
	import { getContext } from 'svelte';

	export let index: number;
	export let type: 'dimension' | 'option';
	const dimensions: Writable<Dimension[]> = getContext('dimensions');
	const options: Writable<Option[]> = getContext('options');

	function removeInput(i: number, t: 'dimension' | 'option') {
		console.dir({ removing: i, t }, { depth: null });
		if (t === 'dimension' && $dimensions[i]) {
			const dimensionsLength = $dimensions.length;
			dimensions.update((dims) => dims.toSpliced(i, 1));
			options.update((opts) => {
				return opts
					.map((opt) => {
						if (opt.ratings.length === dimensionsLength) {
							opt.ratings = opt.ratings.toSpliced(i, 1);
						}
						if (opt.ratings.length === 0) {
							return null;
						}
						return opt;
					})
					.filter((o) => !!o);
			});
		} else if (t === 'option') {
			options.update((opts) => opts.toSpliced(i, 1));
		}
	}
</script>

<button class="delete-button" on:click={() => removeInput(index, type)}>Remove</button>

<style>
	.delete-button {
		background-color: white;
		color: var(--primary-color);
		border: var(--primary-color) 3px solid;
	}
</style>
