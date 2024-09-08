<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Dimension, NewDimension } from '$lib/types';
	import { getContext } from 'svelte';
	import Delete from './Delete.svelte';

	const dimensions: Writable<Dimension[]> = getContext('dimensions');
	export let newDimension: Writable<NewDimension>;

	function addDimension() {
		if ($newDimension.name && ($newDimension.importance ?? 0) > 0) {
			dimensions.update((dims) => [
				...dims,
				{
					name: $newDimension.name,
					importance: $newDimension.importance ?? 0
				}
			]);
			$newDimension.name = '';
			$newDimension.importance = undefined;
		}
	}
</script>

<section class="dimension-input">
	<h2 data-testid="dimensions-title">Enter Dimensions</h2>
	<p>
		We will later define some options, but before we do that, let's define the dimensions that we
		will rate the options on. For example, if you are comparing car options, some dimensions may be
		the <strong>speed</strong>, the <strong>price</strong>, and <strong>the interior</strong>.
	</p>
	<p>For each dimension you choose, add a number for how important this feature is to you.</p>
	<ul class="dimension-list">
		{#if $dimensions.length > 0}
			<h3>Chosen Dimensions</h3>
		{/if}
		{#each $dimensions as dimension, index}
			<li class="dimension-item">
				<span class="dimension-name">{dimension.name}</span>
				<span class="dimension-importance">Importance: {dimension.importance}</span>
				<Delete {index} type="dimension"></Delete>
			</li>
		{/each}
	</ul>

	<div class="input-group">
		<div>
			<input
				bind:value={$newDimension.name}
				placeholder="Dimension name"
				data-testid="dimension-name-input"
			/>
		</div>
		<div class="dimension-importance-input">
			<input
				type="number"
				bind:value={$newDimension.importance}
				placeholder="Importance"
				min="0"
				data-testid="dimension-importance-input"
			/>
		</div>
		<div class="dimension-option-button">
			<button on:click={addDimension} data-testid="dimension-add-button">Add Dimension</button>
		</div>
	</div>
</section>

<style>
	.dimension-input {
		margin-bottom: 20px;
	}

	.dimension-list {
		margin-bottom: 20px;
	}

	.dimension-item {
		display: flex;
		justify-content: space-between;
		background-color: var(--selection-background-color);
		padding: 10px;
		border-radius: 4px;
		margin-bottom: 5px;
	}

	.dimension-name {
		font-weight: bold;
		word-wrap: break-word;
	}

	.input-group {
		display: flex;
		flex-direction: column;
	}

	.input-group input {
		flex: 1;
		min-width: 120px;
		field-sizing: content;
		max-width: 82vw;
	}

	.dimension-importance-input {
		margin-left: 30px;
	}

	.dimension-option-button {
		display: inline-block;
	}
</style>
